import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'

function App() {

  function getLocalStorage(){
    let list = localStorage.getItem('list')
    if(list){
      return (list = JSON.parse(localStorage.getItem('list')))
    }else{
      return [];
    }
  }

  //useStates 
  let [inputValue,setInputValue] = useState("")
  let [list,setList]=useState(getLocalStorage()) 
  let [alert,setAlert] = useState({show: false, type:'', msg:'' })
  let [isEditing,setIsEditing] = useState(false)
  let [editId, setEditId] = useState(null)

  useEffect(() => {
    localStorage.setItem('list',JSON.stringify(list))
  }, [list])

  const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg });
  };

  function editItem(id){
    let choosenItem = list.find((item) => (item.id)===id)
    setIsEditing(true)
    setEditId(id)
    setInputValue(choosenItem.title)
  }

  function removeItem(id){
    showAlert(true,'danger','Item Removed')
    setList(list.filter((item)=>item.id !== id))
  }

  function clearItems(){
    showAlert(true,'danger','Empty List')
    setList([])
  }

  function submitHandler(e){
    e.preventDefault()
    if(!inputValue){
      showAlert(true,'danger','Please Enter Value',)
    }else if(inputValue && isEditing){
      setList(list.map((item)=>{
        if(item.id === editId){
          return {...item , title:inputValue}
        }
        return item;
      }))
      setInputValue("")
      setEditId(null)
      setIsEditing(false)
      showAlert(true,'success','Value Edited')
    }
    else{
      let newItem = {id: new Date().getTime().toString(), title:inputValue}
      setList([...list,newItem])
      setInputValue("")
      showAlert(true,'success','Item Added To The List',)
    }
  }

  return <section className='section-center'>
      <form className="grocery-form" onSubmit={submitHandler}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
          <h3>Grocery Bud</h3>
          <div className="form-control">  
            <input type="text" className='grocery' placeholder='e.g. eggs' value={inputValue} onChange={(e)=>setInputValue(e.target.value)}/>
            <button className='submit-btn' >{isEditing ? 'Edit' :'Submit'}</button>
          </div>
      </form>
      {list.length >0 && <div className="grocery-container">
        <List items={list} removeItem={removeItem} editItem={editItem}/>
      </div>
      }
      
      <button className='clear-btn' onClick={clearItems}>Clear</button>
  </section>
}

export default App
