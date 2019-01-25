# Program & Database Description

Written by Zhuorui Zheng.

### introduction and pre-knowledge

​	The program is mainly receive data from Wechat applet and calculate some index about these data, it likes backend and not exposed to other people.However, I don't care about anything security. It's best that you have time to change it safer.

​	Before reading and modifying the code, please make sure that you are skilled in node.js, including the express, the promise and so on. You should also know about the Mongo which is a popular No-sql database.

### Program index:

​	If you know about express framework, you will know each file is doing what. Here are some details.

​	Because it's a backend program, so the view is none.

​	In routes: I only write the dbcommon.js and indexCalc.js, the first is simple function to deal the easy insertion to database, the second is function to deal the easy index requirement and push these requirement to corresponding function.

​	In Public: I write util.js and indexCalc.js now, there are some common function in util.js, and indexCalc.js is to calculate some easy index.

​	Why I name indexCalc.js, because I don't know there are so many index to ask for. I name it first and I am too lazy to change it.

### Database collection

​	I don't know mongodb before and reject it at first. However, I think it so good when I use it. It's friendly to programmer and I suggest you learn it strongly.

​	Due to historical problems, the previous data in collection are not respond the format. It's nothing, please forget it.

​	We store up the index because I don't want the next people repeat calculating it. 

​	complex_index:{organization: str,type: str,year: int, month: int}, to store complex index

​	(expert,residence,mutual_comment,self_evaluation,serviceobject,worker)(\_begin|\_end|\_middle): depend on the Wechat applet

​	(expert,residence,mutual_comment,self_evaluation,serviceobject)(\_begin|\_end|\_middle)_index: simple average score, it's a bad design but I have create these  before...

​	organization: {province: str, city: str, district: str, street: str, community: str, organization: str} to store the organization message

​	index_stat:{"collectionName": str,type: str, year: str,} to judge if a index have calculated before.



# 文档



## 注意：

1.小程序上传视频不可过大，最好在几十秒中

2.小程序图片的上传暂时不能在相册里面多次以前点选，只能一张一张选，然后上传

3.支持同一活动多点多次上传，但请保证一些选项相同（工作流中有详细解释）





## 建议工作流： 



小程序二维码：

## ![Screen Shot 2017-09-05 at 10.04.10 PM](截图/Screen Shot 2017-09-05 at 10.04.10 PM.png)

### 阿姨：

1.扫描上述二维码, 进入小程序（发布之后可以搜索，不用搜索，目前是测试阶段）

 ![居民](截图/居民.png)





2.在小程序首页点击***绿色居民图标***进入对应页面填写

3.选择组织名称和日期，要求必填自己姓名和活动感受，其他可以自行填写

（**注意组织名称和日期决定同一个活动，所以在补充同一个活动的时候，记得保持组织名称和日期一致！！！！！！**）

（注意只要选择相同的组织名称和日期，则评论人可以归结到同一个活动中）



### 工作人员：

1.扫描上述二维码, 进入小程序（发布之后可以搜索，不用搜索，目前是测试阶段）

2.在小程序首页点击***蓝色工作人员图标***进入对应页面填写

 ![居民](截图/居民.png)





3.选择活动名称（hdmc）日期（date）开始时间（beginTime）结束时间（endTime）跟访人姓名（gfrxm），

（**注意上述五个变量决定同一个活动，所以要补充同一个活动的时候，记得保持上述五个变量一致！！！！！！**）

要求至少上传一张图片，其他可以自行填写





4.（可选）如果需要补充很长的日志，

1.可以登录网站 http://www.hazelnutsgz.com:5000/log/worker,

 ![Screen Shot 2017-09-05 at 10.32.00 PM](截图/Screen Shot 2017-09-05 at 10.32.00 PM.png)

2.在下图的查找框内搜索自己名字， ![Screen Shot 2017-09-05 at 10.34.54 PM](截图/Screen Shot 2017-09-05 at 10.34.54 PM.png)

3.点击补充完成日志的补充，再在页面左下角点击提交按钮，完成提交

 ![Screen Shot 2017-09-05 at 10.37.12 PM](截图/Screen Shot 2017-09-05 at 10.37.12 PM.png)





### 系统管理员



#### 查看文本数据

利用软件**studio 3T**查看数据库数据



#### 查看多媒体数据

1.登录网站：http://www.hazelnutsgz.com:1001/

![Screen Shot 2017-09-05 at 10.57.41 PM](截图/Screen Shot 2017-09-05 at 10.57.41 PM.png)

根据**文本数据库**中的路径在这个可视化目录下查看相应的资料2.测试github用户名


