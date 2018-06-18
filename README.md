# DB project Document

contributed by <`謝耀賢`>

## Environment Setup

```shell
$ npm install
```

## Execute

```shell
$ npm start
```

## package(LINUX)

```shell
$ npm run-script build
# it'll create a new folder 'dist' and executable files are inside it
# (deb, tar.xz)
$ ls ./dist
db-project_1.0.0_amd64.deb electron-builder-effective-
config.yaml db-project-1.0.0.tar.xz linux-unpacked
```

## Screenshot

### Import sql file

- Click "Import Database"

![](https://i.imgur.com/sLksoEO.png)

- Input filepath

![](https://i.imgur.com/Kv9anfo.png)

- Result

![](https://i.imgur.com/ZXRSsvK.png)

![](https://i.imgur.com/luHTUba.png)

### Browse Data

you can select option(tablelist) of the database to browse the data in the table.

![](https://i.imgur.com/xp6gplh.png)

### SQL command

Just input sql command inside the textarea and click the **Query** button.

![](https://i.imgur.com/zPhmWEL.png)

### Button Operation

![](https://i.imgur.com/HYWnOPu.png)

- Insert - 依序輸入`TABLE`, `ATTRIBUTE`，即可新增資料
- Update - 依序輸入 `TABLE`, `ATTRIBUTE`, `VALUE`, `ACCORDING ATTRIBUTE`, `ACCORDING ATTRIBUTE VALUE` 即可
- Delete - 依序輸入 `TABLE`, `ATTRIBUTE`, `VALUE` 即可

> 須注意，若輸入的值是一字串，記得在字串上加上 `''`
> e.g. test => 'test'

- Table
- Attribute - 對應各個 `TABLE` 的所有 `ATTRIBUTE`
- Nested - 選擇功能
    - `NONE`, `IN`, `NOTIN`, `EXISTS`, `NOT EXISTS`
- Aggrgate - 選擇功能
    - `COUNT`, `SUM`, `MAX`, `MIN`, `AVG`, `HAVING`
- Keywords
    - `EXISTS`, `NOT EXISTS`, `IN`, `NOT IN` 情況下要輸入 SELECT STATEMENT， 不選擇則是使用 `LIKE` 功能，輸入 keyword 即可(須以 `space` 或 `,` 做間隔)
- Having - 只使用於 `HAVING` 功能，其餘功能輸入亦無效

## ER diagram

![](https://i.imgur.com/aTVncds.png)

## Relation Schema

![](https://i.imgur.com/Q8tHMT6.png)


## Table

- Player 玩家
    - playerID PK
    - name PK 玩家名字
    - money 玩家金錢擁有量
    - energy 玩家能量擁有量
    - people 玩家人單位擁有量
- production_building 生產型建築物
    - p_buildingID PK
    - name 建築物名稱
    - sizeRow 建築物寬(2D)
    - sizeCol 建築物長(2D)
    - environment FK 建築物所位於的環境
    - production 生產物(energy, money, people)
- funcitonal_building 功能型建築物
    - f_buildingID PK
    - name 建築物名稱
    - sizeRow 建築物寬(2D)
    - sizeCol 建築物長(2D)
    - environment FK 建築物所位於的環境
- environment 環境
    - environmentID PK
    - name PK 環境名稱
    - color 此環境在地圖上所顯示之顏色
- monster 怪物
    - monsterID PK
    - name 怪物名稱
    - environment PK 怪物所在環境


## Relation

- player - player : 攻擊(fight), 同盟(alliance) 關係
- player - production_building - functional_building 玩家建造建築物(build)
- production_building - functional_building - environment 建築物被建造在哪個環境(built in)
- player - monster 玩家殺怪物(kill)
- monster - environment 怪物住在哪個環境(live)