// 개발자 도구 감지 및 차단 시도 (완벽하지 않음)
(function() {
    // F12 키 차단
    document.addEventListener('keydown', function(e) {
        if (e.key === 'F12') {
            e.preventDefault(); // 기본 동작(개발자 도구 열기) 방지
            alert('개발자 도구 사용은 허용되지 않습니다.'); // 사용자에게 알림 (선택 사항)
        }
    });

    // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U (소스 보기) 차단
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) {
            e.preventDefault();
            alert('개발자 도구 사용은 허용되지 않습니다.');
        }
        if (e.ctrlKey && e.key === 'U') {
            e.preventDefault();
            alert('소스 보기 기능은 허용되지 않습니다.');
        }
    });

    // 오른쪽 클릭(컨텍스트 메뉴) 차단 (소스 보기 등)
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault(); // 기본 컨텍스트 메뉴 방지
        alert('오른쪽 클릭은 허용되지 않습니다.');
    });

    // 개발자 도구 창 크기 감지 (지속적인 감시)
    // 이 방법은 개발자 도구가 별도 창으로 열릴 때 효과적입니다.
    // 개발자 도구가 브라우저 창에 독(dock)될 경우 감지하기 어렵습니다.
    const threshold = 160; // 개발자 도구가 열릴 때 예상되는 창 너비/높이 변화 임계값

    function checkDevTools() {
        if (window.outerWidth - window.innerWidth > threshold ||
            window.outerHeight - window.innerHeight > threshold) {
            // 개발자 도구가 열렸을 가능성
            // 여기에 원하는 동작을 추가 (예: 페이지 리다이렉트, 메시지 표시 등)
            // alert('개발자 도구가 감지되었습니다!');
            // window.location.href = 'about:blank'; // 페이지를 빈 페이지로 이동
        }
    }

    // 주기적으로 개발자 도구 감지
    // setInterval(checkDevTools, 1000); // 1초마다 체크

    // 창 크기 변경 시 개발자 도구 감지
    // window.addEventListener('resize', checkDevTools);

    // 디버거 문(debugger statement) 사용 (크롬 등 일부 브라우저에서 개발자 도구 자동 열림)
    // 이 방법은 남용 시 성능 저하 및 무한 루프 가능성이 있으므로 주의하여 사용해야 합니다.
    // debugger; // 이 코드가 실행되면 개발자 도구가 자동으로 열릴 수 있습니다.
    // (function loop() {
    //     debugger;
    //     setTimeout(loop, 100); // 주기적으로 디버거 실행
    // })();

})(); // 즉시 실행 함수로 스코프 분리