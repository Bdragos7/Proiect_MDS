async function creareReports() {

    client.query("select salary from employees", function(err,rezSalary){
        if(err){
            console.log(err)
            renderError(res,2);
        }
        client.query("select lastname from employees", function(err,rezName){
        
            if(err){
                console.log(err)
                renderError(res,2);
            }
            else
                res.render("pagini/reports", {values:rezSalary.rows, labels:rezName.rows});
    });

    
    
    });


    chartFacturi=new Chart(
        document.getElementById('reports'),
        {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Salariu',
                data: values, 
              }
            ]
          }
        }
      )
}

window.addEventListener("load", function(){
    creareReports();
  
})