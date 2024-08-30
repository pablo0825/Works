const imgslider = document.querySelector('.carousel_img-slider');
const imgfruit = document.querySelectorAll('.carousel_img-item.carousel_fruit');

const infobox = document.querySelector('.carousel_info-box');
const infoslider = document.querySelector('.carousel_info-slider');

const bgs = document.querySelectorAll('.carousel_bg');

const nextbtn = document.querySelector('.carousel_next-btn');
const prevbtn = document.querySelector('.carousel_prev-btn');

let indexSlider = 0;//應該是滑塊計數
let index = 0;
let direction;


nextbtn.addEventListener('click', () => {

    indexSlider++;
    
    imgslider.style.transform = `rotate(${indexSlider * -90}deg)`;

    index++;

    //index超出imgfruit的陣列長度，index就歸零
    if(index > imgfruit.length -1 ){
        index = 0;
    }

    document.querySelector('.carousel_fruit.active').classList.remove('active');
    imgfruit[index].classList.add('active');

    document.querySelector('.carousel_bg.active').classList.remove('active');
    bgs[index].classList.add('active');

    if(direction == 1) {

        infoslider.prepend(infoslider.lastElementChild);
        console.log('2');

    }

    direction = -1;

    infobox.style.justifycontent = 'flex-start';
    infoslider.style.transform = 'translateY(-25%)';
});

prevbtn.addEventListener('click', () => {

    indexSlider--;

    imgslider.style.transform = `rotate(${indexSlider * -90}deg)`;

    index--;

    //index超出imgfruit的陣列長度，index就歸零
    if(index < 0 ){
        index = imgfruit.length -1;
    }

    document.querySelector('.carousel_fruit.active').classList.remove('active');
    imgfruit[index].classList.add('active');

    document.querySelector('.carousel_bg.active').classList.remove('active');
    bgs[index].classList.add('active');

    if(direction == -1) {

        infoslider.appendChild(infoslider.firstElementChild);
        console.log('1');

    } 

    direction = 1;

    infobox.style.justifycontent = 'flex-end';
    infoslider.style.transform = 'translateY(25%)';
});


infoslider.addEventListener('transitionend', () => {

    if(direction == -1) {

        infoslider.appendChild(infoslider.firstElementChild);
        console.log('3');
        

    } else if(direction == 1) {

        infoslider.prepend(infoslider.lastElementChild);
        console.log('4');

    }

    infoslider.style.transition = 'none';
    infoslider.style.transform = 'translateY(0)';

    setTimeout(() => {
        infoslider.style.transition = '0.5s cubic-bezier(0.645, 0.045, 0.355, 1)';
    });
});

