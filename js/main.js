$(function() {

  $('.main-slider__inner').slick({
    arrows: false,
    dots: true
  });

	//Валидатор форм и маска для форм
	const offerFormModal = $('.offer-form-modal')
	offerFormModal.submit(function(e) {
			e.preventDefault()
	})

	offerFormModal.validate({
			errorElement: "",
			errorPlacement: (error, element) =>
					error.appendTo(element.parent().parent()),
			rules: {
					tel: {
							maskRu: true
					}
			},
			messages: {
					name: "",
					tel: ""
			},
			submitHandler: function (form) {
					const formInstance = $(form)

					console.log('submit')
					$.ajax({
							type: "POST",
							url: "mail.php",
							data: formInstance.serialize()
					}).done(function() {
							console.log('DONE')
							formInput.val("");
							formInput.siblings().removeClass('active')
							$('.modal-wrapper-offer .success-message').addClass('show')
					});
					return false;
			}
	});
	jQuery.validator.addMethod('maskRu', function(value, element) {
			console.log(/\+\d{1}\(\d{3}\)\d{3}-\d{4}/g.test(value));
			return /\+\d{1}\(\d{3}\)\d{3}-\d{4}/g.test(value);
	});
	$('[name="tel"]').mask("+7(999)999-9999",{autoclear: false});

});

//Модальные окна на Pure Js
(function() {
  
  //Вызов окна колбека
  // openCallback = document.querySelector('.openCallback');
  // callbackModal = document.querySelector('.modal-wrapper__callback');

  // openCallback.addEventListener('click', function () {
  //   openBaseModal();
  //   callbackModal.classList.remove('hidden');
  //   setTimeout(function () {
  //     callbackModal.classList.remove('animation');
  //   }, 20);
  // })

  // function closecallbackPopup() {
  //   if (!callbackModal.classList.contains('hidden')) {
  //     callbackModal.classList.add('animation');    
  //     callbackModal.addEventListener('transitionend', function(e) {
  //       callbackModal.classList.add('hidden');
  //     }, {
  //       capture: false,
  //       once: true,
  //       passive: false
  //     });
  //   }
  // };

  //Вызов окна колбека
  openLeftMenu = document.querySelector('.openMenu');
  leftMenuModal = document.querySelector('.modal-wrapper__left-menu');

  openLeftMenu.addEventListener('click', function () {
    openBaseModal();
    leftMenuModal.classList.remove('hidden');
    setTimeout(function () {
      leftMenuModal.classList.remove('animation');
    }, 20);
  })

  function closeleftMenuModal() {
    if (!leftMenuModal.classList.contains('hidden')) {
      leftMenuModal.classList.add('animation');    
      leftMenuModal.addEventListener('transitionend', function(e) {
        leftMenuModal.classList.add('hidden');
      }, {
        capture: false,
        once: true,
        passive: false
      });
    }

  };

  function closeAllModal() {
    // closecallbackPopup();
    closeleftMenuModal();
    closeBaseModal();
  };

  //База модальных окон
  body = document.querySelector('body');
  modalWrapper = document.querySelector('.modal-wrapper');
  modalWrapperBg = document.querySelector('.modal-wrapper__bg');
  modalWrapperClose = document.querySelectorAll('.modal-wrapper__close');

  function openBaseModal() {
    body.classList.add('noflow');
    modalWrapper.classList.remove('hidden');
    setTimeout(function () {
      modalWrapper.classList.remove('animation');
    }, 20);
  };

  function closeBaseModal() {
    body.classList.remove('noflow');
    modalWrapper.classList.add('animation');    
    modalWrapper.addEventListener('transitionend', function(e) {
      modalWrapper.classList.add('hidden');
    }, {
      capture: false,
      once: true,
      passive: false
    });
  };

  for(let i = 0; i<modalWrapperClose.length; i++){
    modalWrapperClose[i].addEventListener('click', () => {
      closeAllModal();
    });
  }

  modalWrapperBg.addEventListener('click', function () {
    closeAllModal();
  })

  document.onkeydown = function(e) {
    e = e || window.event;
    if (e.key=='Escape'||e.key=='Esc'||e.keyCode==27) {
      closeAllModal();
    }
  };

})();



(function() {

  threeOne = document.querySelector('#threeOne');

  var mousePos = {x:.5,y:.5};
  document.addEventListener('mousemove', function (event) {  mousePos = {x:event.clientX/window.innerWidth, y:event.clientY/window.innerHeight};});
  var phase = 0;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(95, 1000 / 1000, 0.1, 1000);
  camera.position.z = 45;

  var renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(1000, 1000);
  threeOne.appendChild(renderer.domElement);

  var boxSize = 0.2;
  var geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
  var materialGreen = new THREE.MeshBasicMaterial({transparent: true,  color: 0xff007a,  opacity: 0.4,  side: THREE.DoubleSide});

  var pitchSegments = 60;
  var elevationSegments = pitchSegments/2;
  var particles = pitchSegments*elevationSegments
  var side = Math.pow(particles, 1/3);

  var radius = 16;

  var parentContainer = new THREE.Object3D();
  // parentContainer.position.x = 30;
  scene.add(parentContainer);

  function posInBox(place) {
    return ((place/side) - 0.5) * radius * 1.2;  
  }

  //Plant the seeds, grow some trees in a grid!
  for (var p = 0; p < pitchSegments; p++) {
    var pitch = Math.PI * 2 * p / pitchSegments ;
    for (var e = 0; e < elevationSegments; e++) {
      var elevation = Math.PI  * ((e / elevationSegments)-0.5)
      var particle = new THREE.Mesh(geometry, materialGreen);
      
      
      parentContainer.add(particle);

      var dest = new THREE.Vector3();
      dest.z = (Math.sin(pitch) * Math.cos(elevation)) * radius; //z pos in sphere
      dest.x = (Math.cos(pitch) * Math.cos(elevation)) * radius; //x pos in sphere
      dest.y = Math.sin(elevation) * radius; //y pos in sphere

      particle.position.x = posInBox(parentContainer.children.length % side);
      particle.position.y = posInBox(Math.floor(parentContainer.children.length/side) % side);
      particle.position.z = posInBox(Math.floor(parentContainer.children.length/Math.pow(side,2)) % side);
      console.log(side, parentContainer.children.length, particle.position.x, particle.position.y, particle.position.z)
      particle.userData = {dests: [dest,particle.position.clone()], speed: new THREE.Vector3() };
    }
  }

  function render() {
    phase += 0.002;
    for (var i = 0, l = parentContainer.children.length; i < l; i++) {
      var particle = parentContainer.children[i];
      var dest = particle.userData.dests[Math.floor(phase)%particle.userData.dests.length].clone();
      var diff = dest.sub(particle.position);
      particle.userData.speed.divideScalar(1.02); // Some drag on the speed
      particle.userData.speed.add(diff.divideScalar(400));// Modify speed by a fraction of the distance to the dest    
      particle.position.add(particle.userData.speed);
      particle.lookAt(dest);
    }
    
    parentContainer.rotation.y = phase*3;
    parentContainer.rotation.x = (mousePos.y-0.5) * Math.PI;
    parentContainer.rotation.z = (mousePos.x-0.5) * Math.PI;

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render();
})();