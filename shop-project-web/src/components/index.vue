<style scoped xmlns:v-bind="http://www.w3.org/1999/xhtml">
  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }
  .layout-logo{
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
  }
  .layout-nav{
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
  }
  .layout-footer-center{
    text-align: center;
  }

  #productBox{
    margin: 0px auto;
    width: 1400px;
  }
  #productBox ul{
    display: flex;
    flex-wrap: wrap;
  }
  #productBox li{
    padding: 10px;
    list-style: none;
    margin-right: 30px;
    margin-top: 30px;
    border: 1px solid #eee;
  }
  #productBox img{
    width: 220px;
    height: 220px;
  }
  #pageBox{
    margin-top: 40px;
  }
</style>
<template>
  <div class="layout">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="1">
          <div class="layout-logo"></div>
          <div class="layout-nav">
            <MenuItem name="1" @click.native="regist">
              <Icon type="ios-navigate"></Icon>
              注册
            </MenuItem>
            <MenuItem v-if="showLogin" name="2" @click.native="login">
              <Icon type="ios-keypad"></Icon>
              登陆
            </MenuItem>
            <MenuItem v-if="showReLogin" name="3" @click.native="relogin">
              <Icon type="ios-analytics"></Icon>
              退出登陆
            </MenuItem>
            <!--<MenuItem name="4">
              <Icon type="ios-paper"></Icon>
              Item 4
            </MenuItem>-->
          </div>
        </Menu>
      </Header>
      <Content :style="{padding: '0 50px'}">
        <Input v-model="keyword" placeholder="苹果平板" style="width: 500px;margin: 20px;" />
        <Button type="primary" @click="search(keyword,1,pageSize)" icon="ios-search" style="margin-left: -25px;">搜索</Button>
        <Card>
          <div style="width: 1816px;height: 713px;" id="bigBox">

            <div id="productBox">
              <ul>
                <li v-for="v in productList">
                  <img v-bind:src="v.masterPic" alt="">
                  <p v-html="v.productName"></p>
                  <p>￥{{v.productPrice}}</p>
                </li>
              </ul>
            </div>

            <div id="pageBox">
              <Page v-if="totalElements!=0" :total="totalElements" :current="pageNum" :page-size="pageSize" @on-change="handlePage" show-elevator show-total/>
            </div>

          </div>
        </Card>
      </Content>
      <Footer class="layout-footer-center">2020-2025 &copy; LiazhanShop</Footer>
    </Layout>
  </div>
</template>
<script>
  export default {
    data(){
      return{
        showLogin:false,
        showReLogin:false,
        keyword: '',
        productList:[],
        totalElements:0,
        pageNum: 1,
        pageSize: 10,
      }
    },
    created(){
      var loginToken = this.$storage.get("loginToken");
      if(loginToken==null){
        this.showLogin = true;
      }else{
        this.showReLogin = true;
      }
    },
    methods:{
      regist(){
        this.$router.push("/regist");
      },
      login(){
        this.$router.push("/login");
      },
      relogin(){
        this.$storage.remove("loginToken");
        location.reload();
      },
      search(keyword,pageNum,pageSize) {
        if (keyword!='') {
          this.pageNum = pageNum;
          this.$axios.get(this.$productUrl+'search',{
            params: {
              'keyword':keyword,
              'page': pageNum-1,
              'size': pageSize
            }
          }).then(res=>{
            if(res.data.code!=200){
              this.$Message.error(res.data.msg);
            }else {
              this.productList = res.data.data.productList;
              this.totalElements = res.data.data.totalElements;
            }
          }).catch(err=>{
            this.$Message.error(err.response.message);
          });
        }
      },
      handlePage(value){
        this.pageNum = value;
        this.search(this.keyword,this.pageNum,this.pageSize);
      },
    },

  }
</script>
