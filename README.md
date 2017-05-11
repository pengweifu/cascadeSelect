# cascadeSelect
cascade Select


# demo

```
<link rel="stylesheet" href="cascadeSelect.css">
<div id="cascade-box">
    <input type="text" name="" data-value="3058" id="cascade-title" onclick="javascript:selectArea(this);">
</div>
<div id="cascade-box" data-value="3058" id="cascade-title" onclick="javascript:selectArea(this);">
</div>
<script type="text/javascript" src="cascadeSelect.js"></script>
<script type="text/javascript">
var iosProvinces = [
    {'id':'1','value':'北京市','parentId':'0'},
    {'id':'2','value':'天津市','parentId':'0'},
    {'id':'3','value':'河北省','parentId':'0'},
    {'id':'4','value':'山西省','parentId':'0'},
    {'id':'5','value':'内蒙古自治区','parentId':'0'},
    {'id':'6','value':'辽宁省','parentId':'0'},
    {'id':'7','value':'吉林省','parentId':'0'},
    {'id':'8','value':'黑龙江省','parentId':'0'},
    {'id':'9','value':'上海市','parentId':'0'},
    {'id':'10','value':'江苏省','parentId':'0'},
    {'id':'11','value':'浙江省','parentId':'0'},
    {'id':'12','value':'安徽省','parentId':'0'},
    {'id':'13','value':'福建省','parentId':'0'},
    {'id':'14','value':'江西省','parentId':'0'},
    {'id':'15','value':'山东省','parentId':'0'},
    {'id':'16','value':'河南省','parentId':'0'},
    {'id':'17','value':'湖北省','parentId':'0'},
    {'id':'18','value':'湖南省','parentId':'0'},
    {'id':'19','value':'广东省','parentId':'0'},
    {'id':'20','value':'广西壮族自治区','parentId':'0'},
    {'id':'21','value':'海南省','parentId':'0'},
    {'id':'22','value':'重庆市','parentId':'0'},
    {'id':'23','value':'四川省','parentId':'0'},
    {'id':'24','value':'贵州省','parentId':'0'},
    {'id':'25','value':'云南省','parentId':'0'},
    {'id':'26','value':'西藏自治区','parentId':'0'},
    {'id':'27','value':'陕西省','parentId':'0'},
    {'id':'28','value':'甘肃省','parentId':'0'},
    {'id':'29','value':'青海省','parentId':'0'},
    {'id':'30','value':'宁夏回族自治区','parentId':'0'},
    {'id':'31','value':'新疆维吾尔自治区','parentId':'0'},
    {'id':'32','value':'台湾省','parentId':'0'},
    {'id':'33','value':'香港特别行政区','parentId':'0'},
    {'id':'34','value':'澳门特别行政区','parentId':'0'},
    {'id':'35','value':'海外','parentId':'0'},
    {'id':'36','value':'其他','parentId':'0'}
];
function selectArea(obj){
    new cascadeSelect(iosProvinces,{
      level:1,
      parentBox:obj,
      callback:function(container,value,title){
        //
        },
    });
  }
  </script>
```
