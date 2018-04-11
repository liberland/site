if($('body').hasClass('liberland')) {
  var initAboutLL = function(){
     var options = {
  		  useEasing: true,
  		  useGrouping: true,
  		  separator: ',',
  		  decimal: '.',
  		};
  		var citizenships_num= 500,
  			companies_num= 65,
  			offices_num= 95;
  		var citizenships = new CountUp('citizenships', 0, citizenships_num, 0, 1.5, options);
  		var companies = new CountUp('companies', 0, companies_num, 0, 3.5, options);
  		var offices = new CountUp('offices', 0, offices_num, 0, 5.5, options);
  		if (!citizenships.error) {
  			citizenships.start();
  			companies.start();
  			offices.start();
  		} else {
  		  console.error(demo.error);
  		}
  }

  $(document).ready(function(){
      initAboutLL();
      wow.init();
      $(window).on('resize', function(){
  		if ( $(window).width()<768 ) {
  			$("aside").removeClass("active");
  		}
  	});
  });
}
