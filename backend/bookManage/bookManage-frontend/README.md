
>ng new bookManage --skip-install

>yarn

>ng generate component disp

>ng serve --open
----------------------------------------
注意：

1)首次启动，可能typescript版本问题，升级到2.8就好了："typescript": "~2.8.0",

2)有时升级有问题，可以以下解决；
ng update @angular/cli @angular/core 
ng update @angular/cli @angular/core --allow-dirty --force
