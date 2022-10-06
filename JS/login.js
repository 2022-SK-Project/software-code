const firebaseConfig = {
  apiKey: "AIzaSyB688FRjdT9kWdiZ6jBuQ1a29AcW81lWBw",
  authDomain: "goodu-f6bfa.firebaseapp.com",
  projectId: "goodu-f6bfa",
  storageBucket: "goodu-f6bfa.appspot.com",
  messagingSenderId: "513922668749",
  appId: "1:513922668749:web:8a4dee0f6637a91acc3184",
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();
$(document).ready(function ($) {
  // 로그인 콜백
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log(user);
      $(".profile_name").text(user.displayName); // 사용자명 표시
      location.href = "/main.html"; // 메인화면 이동
    } else {
      console.log("log out");
      $(".profile_name").text("");
    }
  });
});

/**
 * 구글 로그인
 */
function googleLogin() {
  // 구글 소셜 로그인
  var provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/plus.login");
  provider.setCustomParameters({
    prompt: "select_account",
  });
  firebase
    .auth()
    .signInWithRedirect(provider)
    .then(function (result) {
      firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          var token = result.credential.accessToken;
          var user = result.user;
        })
        .catch(function (error) {
          var errorCode = error.code;
          var email = error.email;
        });
    });
}

/**
 * 로그아웃
 */
function logOut() {
  // 로그아웃
  firebase
    .auth()
    .signOut()
    .then(
      function () {},
      function (error) {}
    );
}
