var GanttChart = function(containerId, data){
    this.data = data || [];

    this.container = document.getElementById(containerId);

    this.minDate = new Date("2200 January 1");
    this.maxDate = new Date("1990 January 1");

    this.totalDays = 0;

    // number of pixels of screen occupied by one day
    this.pixelsPerDay = 0;
}

// returns the days in a given month
GanttChart.prototype.getDays = function(year, month){
    // 0th day of next month is last day of this month
    return (new Date(year, month + 1, 0)).getDate();
}

// calculates total number of days from minTime to maxTime
GanttChart.prototype.calculateTotalDays = function(){
    this.totalDays = 0;
    // cycle through all months
    for(start = new Date(this.minDate); start.getTime() < this.maxDate.getTime(); start.setMonth(start.getMonth() + 1)){
        this.totalDays += this.getDays(start.getYear(), start.getMonth());
    }
}

GanttChart.prototype.calculatePixelsPerDay = function(){
    this.pixelsPerDay = Math.floor(this.container.offsetWidth/this.totalDays);
}

GanttChart.prototype.daysBetween = function(startDate, endDate){
    return Math.floor(Math.abs(endDate.getTime() - startDate.getTime())/(1000*60*60*24));
}

GanttChart.prototype.process = function(){
    // Calculate min and max date
    for( i = 0; i < this.data.length; i++ ){
        currentStart = new Date(this.data[i].startDate);
        currentEnd = new Date(this.data[i].endDate);

        if ( currentStart.getTime() < this.minDate.getTime() ){
            this.minDate = currentStart;
        }

        if( currentEnd.getTime() > this.maxDate.getTime() ){
            this.maxDate = currentEnd;
        }
    }

    // set to start of the month
    this.minDate.setDate(1);

    // set to end of the month
    this.maxDate.setDate(this.getDays(this.maxDate.getYear(), this.maxDate.getMonth()));

    this.calculateTotalDays();
}

GanttChart.prototype.render = function(){
    this.calculatePixelsPerDay();

    for( i = 0; i < this.data.length; i++ ){
        startDate = new Date(this.data[i].startDate);
        endDate = new Date(this.data[i].endDate);

        this.container.innerHTML += '<div class="time-line" style="width:'+(this.daysBetween(startDate, endDate)+1)*this.pixelsPerDay+'px; margin-left:'+this.daysBetween(this.minDate, startDate)*this.pixelsPerDay+'px"></div>';
    }

    this.container.style.background = 'repeating-linear-gradient(90deg, #fafafa, #fafafa '+this.pixelsPerDay+'px, #f5f5f5 '+this.pixelsPerDay+'px, #f5f5f5 '+this.pixelsPerDay*2+'px)';
}
