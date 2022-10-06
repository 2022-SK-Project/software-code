
var qrValue;
var deviceCount = 0;

db.collection("qr").get().then((snapshot) => {
    snapshot.forEach((prod) => { // 정보 개수만큼 for문 반복
        qrValue = prod.data().qrCode;
        var deviceName = qrValue;
        var deviceSize = Math.floor(qrValue/100)+"L";
        deviceCount++;
        var deviceList = `<small class="liter">${deviceSize}</small>
        <button class="input-box">
            <div>
                <input type="checkbox" id="${deviceCount}" class="ckBox" name="goodyou">
                <label for="2">${deviceName}</label>
            </div>
            <a href="#">삭제</a>
        </button>`
        $('.input-container').append(deviceList);
    });
});
var checkCount;
var remainCoin;
function take(){
    checkCount = $('input:checkbox[name=goodyou]:checked').length;
    if (deviceCount == 0){
        alert('등록된 기기가 없습니다.');
    } else{
        if (checkCount == 0){
            alert('선택된 기기가 없습니다.');
        } else{
            if (confirm(checkCount+"개의 온칩이 사용됩니다.\n결제 하시겠습니까?")){
                if (checkCount > userCoin){
                    alert('온칩이 부족합니다.');
                } else{
                    db.collection("coin").doc(userDoc) // 유저 코인정보
                    .set({
                      coin: userCoin - checkCount, // 코인 추가 해주기
                    })
                    .then(
                        function(){
                            db.collection("coin").doc(userDoc).get()
                              .then((uSnapshot) => {  // 유저 코인 개수 불러오기
                                remainCoin = uSnapshot.data().coin;
                                console.log(remainCoin);
                            });
                            db.collection("usage").add({
                                // 결제 내역 추가
                                coin: checkCount, // 온칩 개수
                                month: new Date().getMonth() + 1, // 월
                                date: new Date().getDate(), // 일
                                hour: new Date().getHours(), // 시
                                minute: new Date().getMinutes(), // 분
                            }).then(
                                function(){
                                    alert('배출되었습니다.');
                                }
                            )
                        }
                    )
                }
            }
        }
    }

    
    
    
}
