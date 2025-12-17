document.addEventListener("DOMContentLoaded", async () => {
  const bank = document.getElementById("bank");
  const currency = document.getElementById("currency");
  const amount = document.getElementById("amount");
  const result = document.getElementById("result");
  const rate = document.getElementById("rate");
  const feeResult = document.getElementById("feeResult");  // 수수료를 출력할 요소 추가

  // 초기에 환율 업데이트
  await updateCurrency();

  // 통화 선택 변경 시 환율 다시 가져오기
  currency.addEventListener("change", updateCurrency);
});

const updateCurrency = async () => {
  const currency = document.getElementById("currency"); 
  const rate = document.getElementById("rate"); // rate 요소 가져오기

  try {
    const url = await fetch(
      `https://v6.exchangerate-api.com/v6/4693021d9a395383df0b73a8/latest/${currency.value}`
    );
    const data = await url.json();

    // KRW 환율 가져오기
    const exchangeRate = data.conversion_rates["KRW"];


    if (exchangeRate) {
      window.exchangeRate = exchangeRate;  
      rate.innerText = `1 ${currency.value} = ${exchangeRate.toFixed(2)} KRW`;
    } else {
      rate.innerText = "환율 정보를 가져올 수 없습니다.";
    }
  } catch (error) {
    console.error("환율 데이터를 가져오는 중 오류 발생:", error);
    rate.innerText = "환율 데이터를 가져올 수 없습니다.";
  }
};

function calculateTotalCost() {
  const amount = document.getElementById("amount").value;  
  const result = document.getElementById("result");
  const feeResult = document.getElementById("feeResult");  
  const currency = document.getElementById("currency");  
  const bank = document.getElementById("bank");  


  if (amount && !isNaN(amount)) {
    const exchangeRate = window.exchangeRate;  
    const bankFee = parseFloat(bank.value);  
    const totalCost = (amount * exchangeRate);  // 환율에 따른 총 금액
    const fee = (totalCost * bankFee);  // 수수료 계산
    const totalWithFee = (totalCost + fee).toFixed(0);  // 수수료 포함한 최종 금액

    result.innerText = `필요한 원화: ${totalWithFee} 원`;
    feeResult.innerText = `수수료: ${fee.toFixed(2)} 원`; 
  } else {
    result.innerText = "유효한 금액을 입력하세요.";
    feeResult.innerText = "";  
  }
}
