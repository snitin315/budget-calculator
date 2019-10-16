// BUDGET CONTROLLER 

var budgetController = (function(){

    
})();


// UI CONTROLLER 

let UIcontroller = (function(){

    let DOMstrings = {
        inputType : '.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value',
        inputBtn : '.add__btn'

    }

    return  {
       getInput : function(){
           
           return {
              
            type : document.querySelector(DOMstrings.inputType).value , // either inc or exp
            description : document.querySelector(DOMstrings.inputDescription).value,
            value : document.querySelector(DOMstrings.inputValue).value
           }
        },

        getDOMstrings : function(){
            return DOMstrings
        }
    }

})();


//GLOBAL APP CONTROLLER



let controller = (function(budgetCtrl,UIctrl){


    let setupEventListeners = function(){
    
    let DOM = UIctrl.getDOMstrings();    
    document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);

    document.addEventListener('keypress', function(event){
       if (event.keyCode === 13 || event.which === 13){
           ctrlAddItem();
       }
    })

    }

   
    let ctrlAddItem = function() {
     
        // Get the input Data

        let input = UIctrl.getInput();
        console.log(input);

    }
    
    return {
        init : function(){
            console.log('Application has started');
            setupEventListeners();
        }
    }
    

})(budgetController,UIcontroller);

controller.init();