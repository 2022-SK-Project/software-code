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

const payDb = firebase.firestore();

/**
 * DB 결제 정보 불러와서 프론트 표시하기
 */
var payHour, payMinute;
payDb.collection("payment").get().then((snapshot) => {
    snapshot.forEach((prod) => { // 정보 개수만큼 for문 반복
      var payData = prod.data();
      if (payData.hour <= 9) { // 9시 이하면 앞에 0 붙여주기 ex) 09
        payHour = "0" + payData.hour;
      } else {
        payHour = payData.hour;
      }
      if (payData.minute <= 9) { // 9분 이하면 앞에 0 붙여주기 ex) 09
        payMinute = "0" + payData.minute;
      } else {
        payMinute = payData.minute;
      }
      var payDay = payData.month + "월 " + payData.date + "일"; // 결제 월일 (month월 day일)
      var payCoin = "온칩 " + payData.coin + "개"; // 온칩 결제한 개수 (온칩 coin개)
      var payTime = payHour + ":" + payMinute; // 결제한 시간 (hour:minute)
      var payAmount = payData.amount + "원"; // 결제 금액 (amount원)
      var template2 = `<div class="onchip">
      <p class="zero">${payDay}</p>
      <div class="coin">
          <img class="coin-img" src="./IMG/coin.png" alt="">
          <div class="text-box">
              <p class="onchip-text">${payCoin}</p>
              <small>${payTime}</small>
          </div>
          <p class="onchip-text-1">${payAmount}</p>
      </div>
      </div>`;
      $(".div-box").append(template2); // 결제 내역 프론트로 보여주기
    });
});
