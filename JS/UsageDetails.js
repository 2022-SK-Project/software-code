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
const usageDb = firebase.firestore();

var usageHour, usageMinute;
usageDb.collection("usage").get().then((snapshot) => {
    snapshot.forEach((prod) => {
      // 정보 개수만큼 for문 반복
      var usageData = prod.data();
      if (usageData.hour <= 9) {
        // 9시 이하면 앞에 0 붙여주기 ex) 09
        usageHour = "0" + usageData.hour;
      } else {
        usageHour = usageData.hour;
      }
      if (usageData.minute <= 9) {
        // 9분 이하면 앞에 0 붙여주기 ex) 09
        usageMinute = "0" + usageData.minute;
      } else {
        usageMinute = usageData.minute;
      }
      var usageDay = usageData.month + "월 " + usageData.date + "일"; // 결제 월일 (month월 day일)
      var usageCoin = "-" + usageData.coin + "개"; // 온칩 결제한 개수 (온칩 coin개)
      var usageTime = usageHour + ":" + usageMinute; // 결제한 시간 (hour:minute)
      var template = `<div class="onchip">
      <p class="zero">${usageDay}</p>
      <div class="coin">
          <img class="coin-img" src="./IMG/coin.png" alt="">
          <div class="text-box">
              <p class="onchip-text">온칩</p>
              <small>${usageTime}</small>
          </div>
          <div class="text-box-2">
              <p class="onchip-text-1">${usageCoin}</p>
          </div>
      </div>
    </div>`;
      $(".div").append(template); // 결제 내역 프론트로 보여주기
    });
});
