import React, { Component } from 'react';
import Total from './components/total/Total'; //During import, you can use other random names for imported components (e.g. import Something from '';), React will still understand that you mean 'Total'; But it will only work for default exported components;
//In order to import a function which is written within some component, you can write: 'import {function} from ''; - moreover, you can re-import and work with functions written for one component for other components as well;
import History from './components/history/History';
import Operation from './components/operation/Operation';


class App extends Component {    //we transformed App function into the class in order to use it for storing Component's STATE; It doesn't return anything but renders stuff, so we use the render() method; but we still need 'return' within this render() method; render() is one of the Component's life cycles;

  state = { //we create and store data within this state; this writing style is equal writing a classical constructor syntax; it's modern and can be used even outside React in Vanilla JS projects;
    transactions: JSON.parse(localStorage.getItem('calcMoney')) || [],
    description: '',
    amount: '',
    resultIncome: 0,
    resultExpenses: 0,
    totalBalance: 0,
  }

  componentWillMount() { //this method helps us update totalBalance before any other operation took place;
    this.getTotalBalance(); //this is to ensure that after the page is updated, calculations could still happen and get rendered on a page;
  }

  componentDidUpdate() { // you can't put state or state updating function here;s
     this.addStorage();
  } //this function puts data into local storage; 

  addTransaction = (add) => {
    const transactions = [...this.state.transactions];

    transactions.push({
      id: `cmr${(+new Date()).toString(16)}`, /*'+' is used to convert Date object into Number in ms (that count from 1970);(16) converts regular number into hexadecimal number; */
      description: this.state.description,
      amount: this.state.amount,
      add
    });

    this.setState({
      transactions,
      description: '',
      amount: '',
    }, this.getTotalBalance()); //this callback function generates total balance; it will be invoked after the global state is updated;
  }

  addDescription = (e) => { //it's a method described in the App class component, so we don't need 'const';
    this.setState({ description: e.target.value }); //works asynchronously;
  }

  addAmount = (e) => { //arrow function doesn't have its own 'this', so it refers to the external global 'this'; 
    this.setState({ amount: e.target.value }); //works asynchronously;
  }

  plusHandler = (acc, curVal) => {
    return acc + curVal;
  };


  getIncome = () => {
    return this.state.transactions.filter((item) => item.add)
      .reduce((acc, item) => acc + Number(item.amount), 0);
  }

  getExpenses = () => {
    return this.state.transactions.filter((item) => !item.add)
      .reduce((acc, item) => acc + Number(item.amount), 0);
  }

  getTotalBalance = () => {
    const resultIncome = this.getIncome();
    const resultExpenses = this.getExpenses();

    const totalBalance = resultIncome - resultExpenses;

    this.setState({ resultIncome, resultExpenses, totalBalance });
  }

  addStorage = () => {
    localStorage.setItem('calcMoney', JSON.stringify(this.state.transactions));
  }

  deleteTransaction = (key) => {
    const transactions = this.state.transactions.filter(item => item.id !== key);
    this.setState({ transactions }, this.getTotalBalance());
  }

  render() {

    return (
      <>
        <header>
          <h1>Кошелек</h1>
          <h2>Калькулятор расходов</h2>
        </header>
        <main>
          <div className="container">
            <Total resultIncome={this.state.resultIncome}
              resultExpenses={this.state.resultExpenses}
              totalBalance={this.state.totalBalance} />
            <History transactions={this.state.transactions}
            deleteTransaction={this.deleteTransaction} />
            <Operation
              addTransaction={this.addTransaction}
              addAmount={this.addAmount}
              addDescription={this.addDescription}
              description={this.state.description}
              amount={this.state.amount} />
          </div>
        </main>
      </>
    );
  }
}
//<React.Fragment> React element can be used instead of <div> as the main  wrapper to optimize the output DOM tree;
//In result, the html will look like <div id="root"> <header> <h1 /> <header /> <main /> etc.
//Moreover, you can use <React.Fragment> in empty brackets - <> </>;


export default App;