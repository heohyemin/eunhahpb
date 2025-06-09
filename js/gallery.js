document.addEventListener('DOMContentLoaded', () => {
    const thumbnailGrid = document.getElementById('thumbnailGrid');
    const toggleButton = document.getElementById('toggleButton');
    const toggleButtonText = document.getElementById('toggleButtonText');
    const toggleButtonIcon = document.getElementById('toggleButtonIcon');
    const imageSliderOverlay = document.getElementById('imageSliderOverlay');
    const fullSizeImage = document.getElementById('fullSizeImage');
    const closeSlider = document.getElementById('closeSlider');
    const prevImageButton = document.getElementById('prevImage');
    const nextImageButton = document.getElementById('nextImage');
    const imageNumbering = document.getElementById('imageNumbering');
    const body = document.body; // body 요소 참조

    // Dummy image data - replace with your actual image paths
    const images = [
        './images/gallery/0-1.jpg',
        './images/gallery/0-2.jpg',
        './images/gallery/50-1.jpg',
        './images/gallery/50-2.jpg',
        './images/gallery/50-3.jpg',
        './images/gallery/50-4.jpg',
        './images/gallery/100-1.jpg',
        './images/gallery/100-2.jpg',
        './images/gallery/100-3.jpg',
        './images/gallery/100-4.jpg',
        './images/gallery/100-5.jpg',
        './images/gallery/200-1.jpg',
        './images/gallery/200-2.jpg',
        './images/gallery/200-3.jpg',
        './images/gallery/200-4.jpg',
        './images/gallery/300-1.jpg',
        './images/gallery/300-2.jpg',
        './images/gallery/300-3.jpg',
        './images/gallery/300-4.jpg',
        './images/gallery/300-5.jpg',
        //'./images/gallery/300-6.jpg',
        './images/gallery/1.jpg',
        './images/gallery/2.jpg',
        './images/gallery/3.jpg',
        './images/gallery/4.jpg',
        './images/gallery/5.jpg',
        './images/gallery/6.jpg',
        './images/gallery/7.jpg',
        './images/gallery/8.jpg',
        './images/gallery/9.jpg',
        './images/gallery/10.jpg',
        './images/gallery/11.jpg',
        './images/gallery/12.jpg',
        './images/gallery/13.jpg',
        './images/gallery/14.jpg',
        './images/gallery/15.jpg',
    ];

    const initialDisplayCount = 9;
    let currentImageIndex = 0;

    // --- 스와이프 기능 관련 변수 ---
    let startX = 0;
    let isSwiping = false;
    const swipeThreshold = 50; // 스와이프로 인식할 최소 픽셀 거리

    // Function to render thumbnails
    function renderThumbnails(count) {
        thumbnailGrid.innerHTML = ''; // Clear existing thumbnails
        for (let i = 0; i < Math.min(count, images.length); i++) {
            const thumbnailItem = document.createElement('div');
            thumbnailItem.classList.add('thumbnail-item');
            thumbnailItem.dataset.index = i;

            const img = document.createElement('img');
            img.src = images[i];
            img.alt = `Thumbnail ${i + 1}`;

            thumbnailItem.appendChild(img);
            thumbnailGrid.appendChild(thumbnailItem);
        }
    }

    // Initial rendering of thumbnails
    renderThumbnails(initialDisplayCount);

    // Toggle "More/Fold" functionality
    toggleButton.addEventListener('click', () => {
        if (thumbnailGrid.children.length === initialDisplayCount) {
            renderThumbnails(images.length); // Show all images
            toggleButtonText.textContent = '접기';
            toggleButtonIcon.src = './images/up-arrow.svg';
        } else {
            renderThumbnails(initialDisplayCount); // Show initial 9 images
            toggleButtonText.textContent = '더보기';
            toggleButtonIcon.src = './images/down-arrow.svg';
            // Scroll to top of gallery if folded
            window.scrollTo({
                top: document.querySelector('.gallery-container').offsetTop,
                behavior: 'smooth'
            });
        }
    });

    // Open image slider
    thumbnailGrid.addEventListener('click', (event) => {
        const thumbnailItem = event.target.closest('.thumbnail-item');
        if (thumbnailItem) {
            currentImageIndex = parseInt(thumbnailItem.dataset.index);
            showImageSlider(currentImageIndex);
        }
    });

    function showImageSlider(index) {
        fullSizeImage.src = images[index];
        imageNumbering.textContent = `${index + 1} / ${images.length}`;
        imageSliderOverlay.classList.add('visible');
        body.classList.add('no-scroll'); // 팝업 활성화 시 스크롤 비활성화
    }

    // Close image slider via close button
    closeSlider.addEventListener('click', () => {
        imageSliderOverlay.classList.remove('visible');
        body.classList.remove('no-scroll'); // 팝업 비활성화 시 스크롤 활성화
    });

    // Previous image
    prevImageButton.addEventListener('click', (event) => {
        event.stopPropagation();
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        showImageSlider(currentImageIndex);
    });

    // Next image
    nextImageButton.addEventListener('click', (event) => {
        event.stopPropagation();
        currentImageIndex = (currentImageIndex + 1) % images.length;
        showImageSlider(currentImageIndex);
    });

    // Keyboard navigation for slider (optional)
    document.addEventListener('keydown', (event) => {
        if (imageSliderOverlay.classList.contains('visible')) {
            if (event.key === 'ArrowLeft') {
                prevImageButton.click();
            } else if (event.key === 'ArrowRight') {
                nextImageButton.click();
            } else if (event.key === 'Escape') {
                closeSlider.click();
            }
        }
    });

    // --- 스와이프 기능 ---

    // 헬퍼 함수: 특정 요소 또는 그 조상 중 하나가 특정 ID를 가진 요소인지 확인
    function isDescendantOf(element, targetId) {
        if (!element) return false;
        let current = element;
        while (current) {
            if (current.id === targetId) {
                return true;
            }
            current = current.parentElement;
        }
        return false;
    }

    // PC: 마우스 다운
    imageSliderOverlay.addEventListener('mousedown', (e) => {
        // 닫기 버튼, 이전/다음 버튼, 넘버링 또는 그 하위 요소를 클릭했을 경우 스와이프 무시
        if (isDescendantOf(e.target, 'closeSlider') ||
            isDescendantOf(e.target, 'prevImage') ||
            isDescendantOf(e.target, 'nextImage') ||
            isDescendantOf(e.target, 'imageNumbering')) {
            return;
        }

        if (e.button === 0) { // 좌클릭만
            startX = e.clientX;
            isSwiping = true;
            imageSliderOverlay.style.userSelect = 'none';
            imageSliderOverlay.style.cursor = 'grabbing';
        }
    });

    // 모바일: 터치 시작
    imageSliderOverlay.addEventListener('touchstart', (e) => {
        // 닫기 버튼, 이전/다음 버튼, 넘버링 또는 그 하위 요소를 터치했을 경우 스와이프 무시
        if (isDescendantOf(e.target, 'closeSlider') ||
            isDescendantOf(e.target, 'prevImage') ||
            isDescendantOf(e.target, 'nextImage') ||
            isDescendantOf(e.target, 'imageNumbering')) {
            return;
        }

        startX = e.touches[0].clientX;
        isSwiping = true;
    });

    // PC: 마우스 이동
    imageSliderOverlay.addEventListener('mousemove', (e) => {
        if (!isSwiping) return;
        e.preventDefault(); // 드래그 중 스크롤 방지
    });

    // 모바일: 터치 이동
    imageSliderOverlay.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        e.preventDefault(); // 스크롤 방지
    }, { passive: false });

    // PC: 마우스 업
    imageSliderOverlay.addEventListener('mouseup', (e) => {
        if (!isSwiping) return;
        isSwiping = false;
        const endX = e.clientX;
        handleSwipe(startX, endX);

        imageSliderOverlay.style.userSelect = '';
        imageSliderOverlay.style.cursor = '';
    });

    // 모바일: 터치 끝
    imageSliderOverlay.addEventListener('touchend', (e) => {
        if (!isSwiping) return;
        isSwiping = false;
        const endX = e.changedTouches[0].clientX;
        handleSwipe(startX, endX);
    });

    // 스와이프 처리 함수
    function handleSwipe(start, end) {
        const diffX = end - start;
        if (Math.abs(diffX) > swipeThreshold) {
            if (diffX > 0) { // 오른쪽으로 스와이프 (이전 이미지)
                prevImageButton.click();
            } else { // 왼쪽으로 스와이프 (다음 이미지)
                nextImageButton.click();
            }
        }
    }
});