<style scoped>
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
        <Breadcrumb :style="{margin: '20px 0'}">
          <BreadcrumbItem>首页</BreadcrumbItem>
          <BreadcrumbItem>商城</BreadcrumbItem>
          <BreadcrumbItem>分类</BreadcrumbItem>
        </Breadcrumb>
        <Card>
          <div style="min-height: 700px;">
            这里是数不清的商品
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
      }
    }
  }
</script>
