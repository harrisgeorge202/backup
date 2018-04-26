Template.sendItem.helpers({
    submittedText2: function () {
            var monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];

            var day = this.submitted.getDate();
            var monthIndex = this.submitted.getMonth();
            var year = this.submitted.getFullYear();
            var hour = addZero(this.submitted.getHours());
            var minute = addZero(this.submitted.getMinutes());

            return day + ' ' + monthNames[monthIndex] + ' ' + year + ' at ' + hour + ':' + minute;
        }
    
});

function addZero(i) {
    if (i < 10) {
        i = '0' + i;
    }
    return i;
}