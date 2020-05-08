<style scoped>
  .formDiv{
    width: 215px;
    height: 800px;
    margin: 0px auto;
    padding-top: 300px;
  }
  .background{
    width:100%;
    height:100%;  /**宽高100%是为了图片铺满屏幕 */
    z-index:-1;
    position: absolute;
  }
  .loginText{
    font-size: 30px;
    color: #464c5b;
    padding-bottom: 20px;
  }
</style>
<template>
  <div>
    <div class="background">
      <img src="../assets/regist_login_bg.jpg" width="100%" height="100%" alt="" />
    </div>
    <div class="formDiv">
      <p class="loginText">登陆</p>
      <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
        <FormItem prop="phone">
          <Input type="text" v-model="formInline.phone" placeholder="手机号">
          <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input type="password" v-model="formInline.password" placeholder="密码">
          <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formInline')">登陆</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        formInline: {
          phone: '',
          password: '',
          loginType: 1,
          deviceInfor: '电脑'
        },
        ruleInline: {
          phone: [
            { required: true, message: '请输入手机号', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$axios({
              url:this.$memberUrl+'login',
              method:'post',
              headers: {
                'Content-Type': 'application/json;charset=UTF-8'
              },
              data: JSON.stringify(this.formInline)
            }).then(res=>{
              if(res.data.code!=200){
                this.$Message.error(res.data.msg);
              }else {
                this.$Message.success(res.data.msg);
                this.$storage.set("loginToken",res.data.data.token);
                this.$router.push("/")
              }
            }).catch(err=>{
              this.$Message.error(err.response.message);
            });
          }
        })
      }
    }
  }
</script>
