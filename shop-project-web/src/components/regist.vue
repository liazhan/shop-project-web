<style scoped>
  .formDiv{
    width: 400px;
    height: 800px;
    margin: 0px auto;
    padding-top: 50px;
  }
  .background{
    width:100%;
    height:100%;  /**宽高100%是为了图片铺满屏幕 */
    z-index:-1;
    position: absolute;
  }
  .registText{
    font-size: 30px;
    color: #464c5b;
    padding-bottom: 20px;
    padding-left: 80px;
  }
</style>
<template>
  <div>
    <div class="background">
      <img src="../assets/regist_login_bg.jpg" width="100%" height="100%" alt="" />
    </div>
    <div class="formDiv">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <p class="registText">注册</p>
        <FormItem label="名称" prop="userName">
          <Input v-model="formValidate.userName" placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem label="手机号" prop="phone">
          <Input type="number" v-model="formValidate.phone" placeholder="请输入手机号"></Input>
        </FormItem>
        <FormItem label="">
          <p>扫描二维码关注公众号，发送手机号获取验证码</p>
          <img style="width:150px;height:150px;" src="../assets/wxcode.jpg"></img>
        </FormItem>
        <FormItem label="验证码" prop="verificationCode">
          <Input type="number" v-model="formValidate.verificationCode" placeholder="请输入验证码"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input type="password" v-model="formValidate.password" placeholder="请输入密码"></Input>
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input v-model="formValidate.email" placeholder="请输入邮箱"></Input>
        </FormItem>
        <FormItem label="性别" prop="sex">
          <RadioGroup v-model="formValidate.sex">
            <Radio label="1">男</Radio>
            <Radio label="0">女</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="年龄" prop="age">
          <Input type="number" v-model="formValidate.age" placeholder="请输入年龄"></Input>
        </FormItem>
        <FormItem label="头像" prop="picUrl">
          <div style="width: 317px;">
            <div style="float: left">
              <Upload
                :before-upload="handleUpload"
                action=""
              >
                <Button icon="ios-cloud-upload-outline">请选择图片</Button>
              </Upload>
              <div v-if="file !== null">上传图片: {{ file.name }} <Button type="text" @click="upload" :loading="loadingStatus">{{ loadingStatus ? '上传中' : '点击上传' }}</Button></div>
            </div>
            <div style="float: right">
              <Avatar shape="square" icon="ios-person" :src="headimg" size="large" />
            </div>
          </div>
          <input style="visibility:hidden;" v-model="formValidate.picUrl" type="text"></input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">注册</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>
  import * as qiniu from 'qiniu-js'
  export default {
    data () {
      return {
        formValidate: {
          userName: '',
          phone: '',
          verificationCode: '',
          password: '',
          email: '',
          sex: '',
          age: '',
          picUrl: '',
        },
        ruleValidate: {
          userName: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '手机号不能为空', trigger: 'blur' }
          ],
          verificationCode: [
            { required: true, message: '验证码不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '邮箱不能为空', trigger: 'blur' },
            { type: 'email', message: '邮箱错误', trigger: 'blur' }
          ],
          sex: [
            { required: true, message: '请选择性别', trigger: 'change' }
          ],
          age: [
            { required: true, message: '请输入年龄', trigger: 'change' }
          ],
          picUrl: [
            { required: true, message: '请上传头像', trigger: 'change' }
          ],
        },
        file: null,
        loadingStatus: false,
        headimg:'',
      }
    },
    methods: {
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$axios({
              url:this.$memberUrl+'regist',
              method:'post',
              headers: {
                'Content-Type': 'application/json;charset=UTF-8'
              },
              data: JSON.stringify(this.formValidate)
            }).then(res=>{
              if(res.data.code!=200){
                this.$Message.error(res.data.msg);
              }else {
                this.$Message.success(res.data.msg);
                this.$router.push("/")
              }
            }).catch(err=>{
              this.$Message.error(err.response.message);
            });
          }
        })
      },
      handleReset (name) {
        this.$refs[name].resetFields();
      },
      handleUpload (file) {
        this.file = file;
        return false;
      },
      upload () {
        this.$axios({
          url:this.$memberUrl+'getUploadHeadImgToken',
          method:'get',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          data: null
        }).then(res=>{
          if(res.data.code!=200){
            this.$Message.error(res.data.msg);
          }else {
            const file = this.file;
            this.uuid();
            const key = this.filename;
            const token = res.data.data.token //从服务器拿的token
            const putExtra = {
              fname: '',
              params: {},
              mimeType: ['image/png', 'image/jpeg', 'image/gif'],
            };
            const config = {
              useCdnDomain: true, //使用cdn加速
            };
            const observable = qiniu.upload(file, key, token, putExtra, config);

            observable.subscribe({
              next: (result) => {
                // 主要用来展示进度
                console.warn(result);
              },
              error: () => {
                this.$Message.error('上传失败');
              },
              complete: (res) => {
                this.$Message.success('上传成功');
                this.headimg = this.$picUrl+res.key;
                this.formValidate.picUrl = res.key;
              },
            });
          }
        }).catch(err=>{
          this.$Message.error('上传失败');
        });
        this.loadingStatus = true;
        setTimeout(() => {
          this.file = null;
          this.loadingStatus = false;
        }, 1500);
      },
      uuid() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "";

        var uuid = s.join("");
        this.filename = uuid
      },
    }
  }
</script>
