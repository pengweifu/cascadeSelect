(function() {
    cascadeSelectUtil = {
      isArray: function(arg1) {
        return Object.prototype.toString.call(arg1) === '[object Array]';
      },
      hasClass: function(e, c) {
        var re = new RegExp("(^|\\s)" + c + "(\\s|$)");
        return re.test(e.className);
      },
      trim: function(str, charlist) {
        var whitespace = [
          ' ',
          '\n',
          '\r',
          '\t',
          '\f',
          '\x0b',
          '\xa0',
          '\u2000',
          '\u2001',
          '\u2002',
          '\u2003',
          '\u2004',
          '\u2005',
          '\u2006',
          '\u2007',
          '\u2008',
          '\u2009',
          '\u200a',
          '\u200b',
          '\u2028',
          '\u2029',
          '\u3000'
        ].join('');
        var l = 0;
        var i = 0;
        str += '';
        if (charlist) {
          whitespace = (charlist + '').replace(/([[\]().?/*{}+$^:])/g, '$1')
        }
        l = str.length;
        for (i = 0; i < l; i++) {
          if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(i);
            break;
          }
        }
        l = str.length;
        for (i = l - 1; i >= 0; i--) {
          if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(0, i + 1);
            break;
          }
        }
        return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
      },
      extend: function(o, n) {
        for (var p in n) {
          if (n.hasOwnProperty(p)) {
            o[p] = n[p];
          }
        }
        return o;
      },
      getByClass:function(parent, cls){
        if(parent.getElementsByClassName){
          return parent.getElementsByClassName(cls);
        }else{
          var res = [];
          var reg = new RegExp(' ' + cls + ' ', 'i')
          var ele = parent.getElementsByTagName('*');
          for(var i = 0; i < ele.length; i++){
            if(reg.test(' ' + ele[i].className + ' ')){
              res.push(ele[i]);
            }
          }
          return res;
        }
      }
    };

    function cascadeSelect(data, options) {
      var defaults = {
        // json数据体相关部分
        nameField: 'id', //数据对象的Id对应键名
        parentField: 'parentId', //数据对象的parentId对应键名
        titleField: 'value', //数据对象的title对应键名
        autoClose:true, // 是否在选择最后一级数据后关闭插件
        level:1, //数据对象层级,仅在autoClose为true时有用
        ajax:false, // 是否ajax获取数据

        // DOM元素相关部分
        parentBox:document.body, // 插件上级包裹元素
        fullPath: false, //存储所有选中的值，以逗号连接，如1,2,3
        defName: '请选择', //默认显示的选项名
        defValue: '0', //默认的选项值

        //回调函数
        afterChange: function(container,value,title) {
        },
        pullData:function(parentId,callback){},
      };
      this.prevArr = new Array();
      this.parentNodes = new Array();
      this.option = cascadeSelectUtil.extend(defaults, options);

      if (this.option.ajax) {
        this.option.pullData(0,function(data2){
          data=data2;
        });
      }
      if (!cascadeSelectUtil.isArray(data) || data.length === 0) {
        return;
      }
      this.data=data;
      var container = document.createElement('div');
      var initVals,initVal=this.option.parentBox.getAttribute('data-path');
      var parentBox,childLi;
      if (this.option.parentBox.tagName=='INPUT') {
        parentBox=this.option.parentBox.parentNode;
      }else{
        parentBox=this.option.parentBox;
        if (cascadeSelectUtil.getByClass(parentBox, 'cascade').length==0) {
          var titleSpan=document.createElement('span');
          titleSpan.className='cascade';
          parentBox.appendChild(titleSpan);
        }
      }
      container.className='cascade-container';
      this.container=container;
      parentBox.style.position='relative';
      parentBox.appendChild(container);
      document.addEventListener('click',function(e){
        if (e.target.nextElementSibling!=container) {
          container.parentNode!=null && container.parentNode.removeChild(container);
        }
      });
      parentBox.addEventListener('click',function(e){
        window.event?e.cancelBubble=true:e.stopPropagation();
      })
      this.showRoot();
      if (initVal!=null) {
        initVals=initVal.split(',');
        for (var i = 0; i < initVals.length; i++) {
          this.childList(initVals[i]);
          childLi=container.getElementsByTagName('ul')[i].getElementsByTagName('li');
          for (var ii = 0; ii < childLi.length; ii++) {
            if(childLi[ii].getAttribute('data-value')==initVals[i]){
              childLi[ii].className = 'selected';
            }
          }
        }
      }
    };
    cascadeSelect.prototype = {
      /**
       * 只显示根级节点
       */
      showRoot: function() {
        var rootArr = new Array();
        for (var i = 0; i < this.data.length; i++) {
          var _index = 0;
          for (var j = 0; j < this.data.length; j++) {
            if (this.data[i][this.option.parentField] == this.data[j][this.option.nameField])
              _index = 1;
          }
          if (_index == 0) {
            rootArr.push(this.data[i]);
          }
        }
        //创建select元素
        this.createSelect(rootArr);
      },
      /**
       * 创建select元素
       */
      createSelect: function(arr) {
        var that = this;
        if (arr != null && arr.length > 0) {
          var select = document.createElement('ul');
          var option = document.createElement('li');
          option.setAttribute('data-value', this.option.defValue);
          var text = document.createTextNode(this.option.defName);
          option.appendChild(text);
          select.appendChild(option);
          for (var i = 0; i < arr.length; i++) {
            option = document.createElement('li');
            option.setAttribute('data-value', arr[i][this.option.nameField]);
            text = document.createTextNode(arr[i][this.option.titleField]);
            option.appendChild(text);
            select.appendChild(option);
          }
          var elem = this.container;
          elem.appendChild(select);
          select.addEventListener('click', function(e) {
            window.event?e.cancelBubble=true:e.stopPropagation();
            var re = new RegExp("(^|\\s)selected(\\s|$)", 'g');
            for (var i = 0; i < cascadeSelectUtil.getByClass(select, 'selected').length; i++) {
              cascadeSelectUtil.getByClass(select, 'selected')[i].className = cascadeSelectUtil.getByClass(select, 'selected')[i].className.replace(re, '');
            }
            e.target.className = 'selected';
            that.changeSelect(select);
          });
        }
      },
      getValue:function(select){
        var ol = select.getElementsByTagName('li').length;
        for (var i = 0; i < ol; i++) {
          if (cascadeSelectUtil.hasClass(select.getElementsByTagName('li')[i], 'selected')) {
            return select.getElementsByTagName('li')[i].getAttribute('data-value');
          }
        }
        return false;
      },
      getTitle:function(select){
        var ol = select.getElementsByTagName('li').length;
        for (var i = 0; i < ol; i++) {
          if (cascadeSelectUtil.hasClass(select.getElementsByTagName('li')[i], 'selected')) {
            return cascadeSelectUtil.trim(select.getElementsByTagName('li')[i].innerHTML);
          }
        }
        return false;
      },
      /**
       * 当选择时调用
       */
      changeSelect: function(select) {
        if (select.nextSibling) {
          this.deleteNext(select.nextSibling);
        }
        this.prevArr = new Array();
        //获取同级前面的元素
        this.prevNodes(select);
        var title,path,ids='',value=this.getValue(select);
        this.childList(value);
        for (var i = 0; i < this.prevArr.length; i++) {
          if (this.getValue(this.prevArr[i]) > this.option.defValue) {
            ids += this.getValue(this.prevArr[i]) + ',';
          }
        }
        path = cascadeSelectUtil.trim(ids, ',');
        if (!this.option.fullPath) {
          if (value <= this.option.defValue) {
            if (this.prevArr.length > 0) {
              value=this.prevArr.length >= 2?this.getValue(this.prevArr[this.prevArr.length - 2]):this.getValue(this.prevArr[this.prevArr.length - 1]);
            }
          }
        }else{
          value=path;
        }
        this.option.parentBox.setAttribute('data-value',value);
        this.option.parentBox.setAttribute('data-path',path);
        ids='';
        for (var i = 0; i < this.prevArr.length; i++) {
          if (this.getValue(this.prevArr[i]) > this.option.defValue) {
            ids += this.getTitle(this.prevArr[i]) + ' ';
          }
        }
        title = cascadeSelectUtil.trim(ids, ' ');
        if (this.option.parentBox.tagName=='INPUT') {
          this.option.parentBox.value=title;
        }else{
          this.container.previousElementSibling.innerHTML=title;
        }
        if (this.option.level==this.prevArr.length || this.getValue(select)==this.option.defValue) {
          this.option.afterChange(this.container,value,title);
          if (this.option.autoClose) {
            this.container.parentNode!=null && this.container.parentNode.removeChild(this.container);
          }
        }
      },
      /**
       * 获取子级节点
       */
      childList: function(thisVal) {
        var childArr = new Array(),that=this;
        var _data;
        if (this.option.ajax) {
          this.option.pullData(thisVal,function(data2){
            _data=data2;
            for (var i = 0; i < _data.length; i++) {
              if (thisVal == _data[i][that.option.parentField]) {
                childArr.push(_data[i]);
              }
            }
            that.createSelect(childArr);
          });
        }else{
          _data=this.data;
          for (var i = 0; i < _data.length; i++) {
            if (thisVal == _data[i][this.option.parentField]) {
              childArr.push(_data[i]);
            }
          }
          this.createSelect(childArr);
        }
      },
      /**
       * 删除当前选择的select后所所有的元素
       */
      deleteNext: function(em) {
        if (em.nextSibling) {
          this.deleteNext(em.nextSibling);
        }
        this.container.removeChild(em);
      },
      /**
       * 获取前面的元素
       */
      prevNodes: function(em) {
        if (em.previousSibling) {
          this.prevNodes(em.previousSibling);
        }
        this.prevArr.push(em);
      }
    };
    if (typeof module != 'undefined' && module.exports) {
      module.exports = cascadeSelect;
    } else if (typeof define == 'function' && define.amd) {
      define(function() {
        return cascadeSelect;
      });
    } else {
      window.cascadeSelect = cascadeSelect;
    }
  })();
