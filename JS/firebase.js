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
const db = firebase.firestore();
var userDoc;
var userName, userEmail, userCoin, userLogin;

$(document).ready(function ($) {
  // 로그인 콜백
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      userLogin = true;
      console.log(user);
      $(".profile_name").html(user.displayName); // 이름 영역에 유저이름 띄우기
      userName = user.displayName;
      userEmail = user.email;
      userDoc = user.uid;
      console.log(userDoc); // 특정 user document 읽어오기
      db.collection("coin")
        .doc(userDoc)
        .get()
        .then((uSnapshot) => {
          console.log(uSnapshot.data().coin); // 유저 코인 개수 불러오기
          userCoin = uSnapshot.data().coin;
          $(".coin_count").html(userCoin); // 유저 코인 개수 표시
        })
        .catch((error) => {
          // 유저 코인 정보가 없을시
          db.collection("coin")
            .doc(userDoc) // 유저 코인정보
            .set({
              coin: 0, // 코인 0으로 설정하기
            });
        });
    } else {
      userLogin = false;
      console.log("not login");
      $(".profile_name").text("");
      $("#logOut").html("로그인");
      $('#logOut').attr("onclick", "myGoogleLogin()");
    }
  });
});

function myGoogleLogin() {
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
function gLogOut() {
  firebase
    .auth()
    .signOut()
    .then(
      function () {
        console.log("LogOut Success");
      },
      function (error) {
        console.log("logOut Failed");
      }
    );
  alert('로그아웃 되었습니다.');
}

/**
 * 카카오페이 결제
 * @param {금액} won
 * @param {갯수} cointCount
 */
function kakaopay(won, coinCount) {
  if (userLogin == true) {
    // 로그인 상태일 시
    var IMP = window.IMP; // 팝업창 띄우기
    IMP.init("imp61861566"); // 가맹점 식별번호
    console.log(userDoc);
    IMP.request_pay(
      {
        pg: "kakaopay",
        pay_method: "kakaopay ",
        merchant_uid: "123456789" + new Date().getTime(),
        name: "온칩 결제" + "(" + coinCount + "개" + ")",
        amount: won,
        buyer_email: userEmail,
        buyer_name: userName,
      },
      function (rsp) {
        if (rsp.success) {
          // 결제 성공시
          console.log("coin success");
          var msg = "결제가 완료되었습니다.";
          location.href = "/main.html"; // 메인 페이지 이동
          alert(
            "결제가 완료 되었습니다.\n온칩 " + coinCount + "개 (" + won + "원)"
          );
        } else {
          var msg = "결제에 실패하였습니다.";
          rsp.error_msg; // 에러 메세지 띄워주기
        }
      }
    );
    db.collection("coin")
      .doc(userDoc) // 유저 코인정보
      .set({
        coin: coinCount + userCoin, // 코인 추가 해주기
      });
    db.collection("payment").add({
      // 결제 내역 추가
      coin: coinCount, // 온칩 개수
      amount: won, // 가격
      month: new Date().getMonth() + 1, // 월
      date: new Date().getDate(), // 일
      hour: new Date().getHours(), // 시
      minute: new Date().getMinutes(), // 분
    });
  } else {
    // 로그아웃 상태일 시
    alert("로그인을 먼저 해주세요!");
  }
}
