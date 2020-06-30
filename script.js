const transactionsUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')



const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'))
let transactions =  localStorage
    .getItem('transactions') !== null ? localStorageTransactions : []

const removeTransaction = ID =>{
    transactions = transactions.filter(transaction => 
        transaction.id !== ID)
    updateLocalStorage()    
    init()
    
}
const addTransactionIntoDOM = transaction => {
    const operation = transaction.amount < 0 ? '-':'+'
    const CSSClass = transaction.amount < 0 ? 'minus':'plus'
    const amoutWithoutOperation = Math.abs(transaction.amount)
    const li =  document.createElement('li')


    li.classList.add(CSSClass)

    li.innerHTML = `
    ${transaction.name} <span>${operation} R$ ${amoutWithoutOperation}</span>
    <button class="delete-btn" onClick="removeTransaction(${transaction.id})">x</button>
    `

    transactionsUl.append(li)

}

const updateBalenceValues = () => {
    const trasactionsAmounts = transactions
        .map(transaction => transaction.amount)
    const total = trasactionsAmounts
        .reduce((accumulator, transaction)=> accumulator + transaction,0)
        .toFixed(2)
    const income = trasactionsAmounts
        .filter(value => value > 0)
        .reduce((accumulator,value) => accumulator + value,0)
        .toFixed(2)
    const expense = Math.abs(trasactionsAmounts
        .filter(value => value < 0)
        .reduce((accumulator,value) => accumulator + value,0))
        .toFixed(2)
    

    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `R$ ${income}`
    expenseDisplay.textContent = `R$ ${expense}`
}
const init = () => {
    transactionsUl.innerHTML = ''
    transactions.forEach(addTransactionIntoDOM)
    updateBalenceValues()
}

init()

const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => Math.round(Math.random()*1000)

const addToTransactionsArray = (transactionName,transactionAmount)=>{
    transactions.push({
        id: generateID(), 
        name: transactionName, 
        amount: Number(transactionAmount)
    })
}

const clearInputs = () => {
    inputTransactionName.value = ''
    inputTransactionAmount.value =''
}

const handleFormSubmit = event => {
    event.preventDefault()

    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = inputTransactionAmount.value.trim().replace(',' , '.')
    const isComeInputEmpty = transactionName ==='' || transactionAmount===''
    if(isComeInputEmpty){
        alert('Por favor, preencha tanto o nome quanto o valor da transação')
        return
    }

    addToTransactionsArray(transactionName,transactionAmount)
    init()
    updateLocalStorage()
    clearInputs()
}

form.addEventListener('submit', handleFormSubmit)