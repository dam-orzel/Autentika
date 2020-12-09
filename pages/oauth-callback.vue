<template>
  <section class="loginPage">
    <div class="login__success" v-if="success">
      <span class="login__text--big">HURRA!</span>
      <span class="login__text--small">
        Zalogowałeś się pomyślnie :)
      </span>
      <span class="login__text--redirect"
        >Za chwilę nastąpi przekierowanie na stronę główną</span
      >
    </div>
    <div class="login__failed" v-if="!success">
      <span class="login__text--big">OOPS!</span>
      <span class="login__text--small">
        Wystąpił błąd podczas logowania :(
      </span>
      <span class="login__text--redirect"
        >Za chwilę nastąpi przekierowanie na stronę główną</span
      >
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      authorizationCode: null,
      accessToken: null,
      success: false
    };
  },
  beforeMount() {
    const param = window.location.search;
    const urlParams = new URLSearchParams(param);
    const authCode = urlParams.get("code");
    this.authorizationCode = authCode;
  },
  mounted() {
    axios
      //Obejście nie zbyt piękne ale działa
      .post(
        `https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token`,
        null,
        {
          params: {
            client_id: "f408ca531d7cf6bbdbb5",
            client_secret: "d6129849a93ad5d3120d965673760a241d3af446",
            code: this.authorizationCode
          },
          headers: { Accept: "application/json" }
        }
      )
      // Jeśli access token jest pusty, użytkownik powinien zalogować się ponownie
      .then(
        response =>
          this.$store.commit(
            "access/sendAccessToken",
            response.data.access_token
          ),
        (this.success = true),
        setTimeout(() => this.$router.push("/"), 2000)
      )
      .catch(
        error => (this.success = false),
        setTimeout(() => this.$router.push("/"), 2000)
      );
  }
};
</script>
<style lang="scss">
section.loginPage {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .login__failed,
  .login__success {
    display: flex;
    flex-direction: column;
    align-items: center;
    .login__text--big {
      font-size: 60px;
      font-weight: 600;
    }
    .login__text--small {
      font-size: 24px;
      margin: 20px 0;
    }
    .login__text--redirect {
      font-size: 12px;
      color: gray;
    }
  }
}
</style>
