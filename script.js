'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};


var accounts = [account1, account2,];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements=function displayMovements(movements) {
  movements.forEach(function(val){
    if(val>0){
      type="deposit";
    }
    else{
      type="withdrawal";
    }
    const html=
       ` <div class="movements__row">
          <div class="movements__type movements__type--${type}">${type}</div>
          <div class="movements__value">${(val).toString()+"€"}</div>
        </div> `;
        containerMovements.insertAdjacentHTML("afterbegin",html);
  });
  var type;
}
displayMovements(account1.movements);
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
/////////////////////////////////////////////////
// To Getting All Username in short
const username="Steven Thomas Williams";
function toGetUsername(accounts){
accounts.forEach(function(val){
  let us=val.owner.toLowerCase().split(' ');
  var s=""
  us.forEach(function(i){
      s+=i.charAt(0);
  })
  val.username=s
  s="" 
})
}
toGetUsername(accounts);
////////////////////////////USERNAME/////////////////////////////////////////////////
function toGetBankBalance(acc){
  var currentBalance=acc.movements.reduce(function(add,value){
    return add+value;
  },0)
  acc.balance=currentBalance;
  labelBalance.textContent=`${currentBalance} EUR`;
}
////////////// updating the bank balance in out
const updateBalanceIncre=function(acc){
  const Balance_in=acc.movements.filter(function(val){
    return val>0;
  })
  const Display_Balance_in=Balance_in.reduce(function(adder,val){
    return adder+val;
  })
  labelSumIn.textContent=Math.abs(Display_Balance_in);
};
///////////////////
const updateBalanceDecre=function(acc){
  const Balance_out=acc.movements.filter(function(val){
    return val<0;
  })
  const Display_Balance_out=Balance_out.reduce(function(adder,val){
    return adder+val;
  })
  labelSumOut.textContent=Math.abs(Display_Balance_out);

};
//////////////////////////////////////
const updateBalanceInterest=function(acc){
  const xx=acc.interestRate;
  const Interest_in=acc.movements.reduce(function(adder,val){
    return adder+val
  },xx)
  labelSumInterest.textContent=Interest_in.toFixed(2);
}
let currentAccount;
const displayerror=(message)=>{
  const b=document.querySelector('.incorrect');
  b.textContent=message;
  setTimeout(()=>(b.textContent=''),500);
}
btnLogin.addEventListener("click",function(e){
  e.preventDefault();
  currentAccount=accounts.find(function(val){
    return  val.username===inputLoginUsername.value;
  })
  if(currentAccount===undefined){
    
    displayerror("Incorrect Password/Username");
    b.style.opacity=0;
  }
  else if(currentAccount.pin===Number(inputLoginPin.value)){
    //Display the user Interface
    const display_text=currentAccount.owner.split(' ')[0];
    labelWelcome.textContent=`Welcome ${display_text},`
    // Bringing back the opacity
    containerApp.style.opacity=100;
    //////
    displayMovements(currentAccount.movements);
    toGetBankBalance(currentAccount);
    updateBalanceIncre(currentAccount);
    updateBalanceDecre(currentAccount);
    updateBalanceInterest(currentAccount)
    /////////
    //clear input fields 
    inputLoginPin.value='';
    inputLoginUsername.value='';
  }
})
////////////// Transferring Amounts
btnTransfer.addEventListener("click",function(e){
  e.preventDefault();
  const amount=Number(inputTransferAmount.value)
  const reciever=accounts.find(function(val){
    return val.username===inputTransferTo.value
  })
  if(amount>0 &&currentAccount.balance>=amount && reciever.username!==currentAccount.username){
      console.log("Transfer Valid");
      currentAccount.balance=currentAccount.balance-amount;
      currentAccount.movements.push(-(amount));
      reciever.movements.push(amount);
      labelBalance.textContent=`${currentAccount.balance} EUR`;
      const h=
       ` <div class="movements__row">
          <div class="movements__type movements__type--withdrawal">withdrawal</div>
          <div class="movements__value">${(amount).toString()+"€"}</div>
        </div> `;
        containerMovements.insertAdjacentHTML("afterbegin",h);

  }
  else if(amount>currentAccount.balance){
    alert("You Don't Enough Balance");
  }
  else{
    alert("Invalid Transfer");
  }
  inputTransferAmount.value='';
  inputTransferTo.value='';
  
})

btnClose.addEventListener("click",function(e){
  e.preventDefault();
  if((inputCloseUsername.value)===currentAccount.username && Number(inputClosePin.value)===currentAccount.pin){
      var index=accounts.findIndex(function(val){
       return val.username===currentAccount.username;
      })
      accounts.splice(index,1);
      containerApp.style.opacity=0;
      labelWelcome.textContent="Log in to get started";
  }
  else{
    alert("Invalid Credentials")
  }

})








btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    // Update UI
    displayMovements(currentAccount.movements);
    toGetBankBalance(currentAccount);
    updateBalanceIncre(currentAccount);
    updateBalanceDecre(currentAccount);
    
  }
  inputLoanAmount.value = '';
});