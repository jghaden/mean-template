function DateFormatted(date) {
    var d = new Date(date),
        minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
        ampm = d.getHours() >= 12 ? 'PM' : 'AM',
        hours = d.getHours(),
        months = ['January','Febuary','March','April','May','June','July','August','September','October','November','December'],
        days = ['Sun','Mon','Tues','Wednes','Thurs','Fri','Satur'];

        if(hours > 12) {
            hours -= 12;
        } else if(hours == 0) {
            hours = 12;
        }

        return days[d.getDay()]+'day '+months[d.getMonth()]+' '+d.getDate()+', '+d.getFullYear()+' '+hours+':'+minutes+' '+ampm;
}

function RandomFillerText() {
    var text = [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit Sed do eiusmod.',
        'Tempor incididunt ut labore et dolore magna aliqua sit amet massa vitae.',
        'Tortor augue ut lectus arcu bibendum at varius vel pharetra Nunc consequat.',
        'Interdum varius sit amet mattis vulputate enim nulla dolor sed viverra.',
        'Ipsum nunc aliquet bibendum enim facilisis tincidunt lobortis feugiat.',
        'Vivamus at vitae suscipit tellus mauris a diam maecenas sed justo laoreet.',
        'Sit amet cursus sit amet. Nulla facilisi cras fermentum odio eu non.',
        'Consectetur a erat nam at lectus urna duis convallis nam aliquam sem et.',
        'Tortor consequat id. Nec feugiat in fermentum posuere urna nec interdum.',
        'Posuere lorem ipsum dolor sit. Aenean euismod elementum nisi quis eleifend.',
        'Quam augue eget arcu dictum varius duis at. Facilisis gravida neque convallis',
        'Vestibulum lectus mauris ultrices eros in cursus turpis massa tincidunt.',
        'Purus in mollis nunc sed id. Mattis rhoncus urna neque viverra justo at quis',
        'Risus sed vulputate. Volutpat odio facilisis mauris sit amet massa vitae.',
        'Vitae aliquet nec ullamcorper sit. Eros donec ac odio tempor orci dapibus.',
        'ultrices donec adipiscing tristique risus nec feugiat in fermentum posuere.',
        'Euismod nisi porta lorem mollis aliquam ut porttitor lectus vestibulum mattis.',
        'Ullamcorper velit sed ullamcorper morbi tincidunt ornare viverra nibh cras.',
        'Pulvinar mattis nunc sed. Tellus in hac habitasse platea hac habitasse platea.',
        'Dictumst quisque sagittis purus sit sed vulputate odio ut enim blandit volutpat.',
        'Tellus elementum sagittis vitae et leo duis ut diam nisl tincidunt eget.',
        'Nullam non nisi. Risus viverra adipiscing at in tellus integer feugiat.',
        'Scelerisque quam viverra orci sagittis eu volutpat. Ultrices tincidunt arcu.',
        'Non sodales neque sodales pellentesque id nibh tortor id aliquet lectus proin.',
        'Lacinia at quis risus sed vulputate odio ut enim malesuada fames ac turpis.',
        'Egestas maecenas pharetra convallis proin sagittis nisl rhoncus mattis.',
        'Rhoncus urna. Iaculis urna id volutpat lacus laoreet non curabitur.',
        'Faucibus interdum posuere lorem ipsum dolor sit amet consectetur.',
        'Tortor pretium viverra suspendisse potenti nullam ac tortor vitae purus.',
        'Vitae sapien pellentesque habitant morbi tristique senectus et.'
    ]

    return text[Math.floor(Math.random() * text.length)];
}