function setOverlay(el, flag = true, amount = 50) {
    if(flag) {
        $('html').addClass('no-scroll');
        $('#nav, #projnav').addClass('no-mouse')
        $('body').addClass('no-highlight')

        if(el === '#main') {
            $('#main, #footer').addClass(['overlay-transition', 'overlay-25']);
        } else {
            switch(amount) {
                case 100:
                    $(el).addClass('overlay-100'); break;
                case 75:
                    $(el).addClass('overlay-75'); break;
                case 50:
                    $(el).addClass('overlay-50'); break;
                case 25:
                    $(el).addClass('overlay-25'); break;
                case 0:
                    $(el).addClass('overlay-0'); break;
            }
        }
    } else {
        $('html').removeClass('no-scroll');
        $('#nav, #projnav').removeClass('no-mouse')
        $('body').removeClass('no-highlight')

        if(el === '#main') {
            $('#main, #footer').removeClass(['overlay-transition', 'overlay-25']);
        } else {
            $(el).removeClass([
                'overlay-100',
                'overlay-75',
                'overlay-50',
                'overlay-25',
                'overlay-0'
            ]);
        }
    }
}

function DateFormatted(date, day = true, time = true) {
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

        return `${day ? days[d.getDay()]+'day' : ''} ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} ${time ? `${hours}:${minutes} ${ampm}` : ''}`;
        // return days[d.getDay()]+'day '+months[d.getMonth()]+' '+d.getDate()+', '+d.getFullYear()+' '+hours+':'+minutes+' '+ampm;
}

function RandomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}

function RandomGreyColor() {
    var colors = [
        '#2e2e2e',
        '#444444',
        '#5e5e5e'
    ];

    return colors[Math.floor(Math.random() * colors.length)];
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

function SetTitle(text) {
    document.title = (!text) ? ('Ark') : (text + ' | Ark');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}  

function StartListeners() {
    $('[contenteditable="true"]').on('keypress', (e) => {
        if(e.keyCode == 13) {
            $(this).trigger('blur');
            return false;
        }
    });
    
    $('[contenteditable="true"]').on('paste', (e) => {
        e.preventDefault();
    
        navigator.clipboard.readText().then(text => {
            document.execCommand("insertHTML", false, text);
        });
    });
}

function TextEdit(el, isEditing, overflow=true) {
    if(isEditing) {
        $(el).addClass('text-edit');
        $('body').addClass('no-scroll');
        if(overflow)
        $(el).removeClass('text-overflow');
    } else {
        $(el).removeClass('text-edit');
        $('body').removeClass('no-scroll');
        if(overflow)
            $(el).addClass('text-overflow');
    }
}

function HoverHandler() {
    sleep(20).then(() => {
        $('.proj-folder, .proj-item').on('mouseout', () => {
            $(this).addClass('mouse-out');
        });

        $('#video').on('mouseout', () => {
            $(this).parent().addClass('mouse-out-inner');
        });
    })
}

const downloadToFile = (content, filename, contentType) => {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });

    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();

    URL.revokeObjectURL(a.href);
}

function DownloadProject(data, name) {
    var zip = new JSZip();

    data.items.forEach(item => {
        zip.file(item.name + '.' + item.type, item._id)
    });

    zip.generateAsync({ type:'blob' })
        .then((blob) => {
            downloadToFile(blob, name + '.zip', 'application/zip');
        });
}