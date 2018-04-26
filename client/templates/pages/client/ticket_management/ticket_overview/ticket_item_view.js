Template.ticketItemView.helpers({

    getReservationNumber : function (packetId) {
        var packetDoc = Packets.findOne({_id: new Mongo.ObjectID(packetId)});
        if(packetDoc){
            return (packetDoc.reservationNumber ? packetDoc.reservationNumber : '');
        }else {
            return ''; 
        }
        
    }, 
    getPhoneNumber : function (packetId) {
        var packetDoc = Packets.findOne({_id: new Mongo.ObjectID(packetId)});
        if(packetDoc){
            return (packetDoc.phoneNumber? packetDoc.phoneNumber : '');
        }else {
            return '';
        }
    }, 
    getRoomNumber : function (packetId) {
        var packetDoc = Packets.findOne({_id: new Mongo.ObjectID(packetId)});
        if(packetDoc){
            return (packetDoc.roomNumber ? packetDoc.roomNumber : '');
        }else {
            return '';
        }
    },
    createdFormat: function () {
        var monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July", 
            "August", "September", "October",
            "November", "December"
        ];
 
        // exception: this.created is not defined??
        var day = this.created.getDate();
        var monthIndex = this.created.getMonth();
        var year = this.created.getFullYear();
        var hour = addZero(this.created.getHours());
        var minute = addZero(this.created.getMinutes());

        return day + ' ' + monthNames[monthIndex] + ' ' + year + ' at ' + hour + ':' + minute;
    }
});

function addZero(i) {
    if (i < 10) {
        i = '0' + i;
    }
    return i;
}
