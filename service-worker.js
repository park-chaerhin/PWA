const sCacheName = "hello-pwa"; //캐시 제목
const aFilesToCache = [ //캐시 할 파일(=인터넷 연결되지 않아도 내 컴퓨터에 저장해서 사용가능) 지정
    './',
    './index.html',
    './manifest.json',
    './images/icons/android-chrome-512x512.png'
];

// 서비스워커 실행 & 캐시파일 저장
self.addEventListener("install", pEvent =>{ // = function(pEvent){} 매개변수 정의x:event정보
    console.log("서비스 워커 설치 완료!");

    // install -> installing : 추가 설치가 필요할 때 event.waitUntil() 사용 -> installed : 설치완료 후 대기상태(waiting)
    pEvent.waitUntil( 
        caches.open(sCacheName) //파일이 있으면 열고 없으면 추가해서 열어
        .then(pCache => { //promise : open 된 다음에 addAll 실행
            console.log('캐시에 파일 저장 완료!');

            return pCache.addAll(aFilesToCache);
        })
    );
});

// 고유 번호 할당받은 서비스 워커 동작 시작
self.addEventListener('activate', pEvent=>{
    console.log('서비스워커 동작 시작됨!');
});

// 데이터 요청 시 네트워크 또는 캐시에서 찾아 반환
self.addEventListener('fetch', pEvent =>{
    pEvent.respondWith(
        caches.match(pEvent.request)
        .then(response => {
            if(!response){ // 온라인
                console.log('네트워크로 데이터 요청!', pEvent.request)
                return fetch(pEvent.request)
            }
            console.log('캐시에서 데이터 요청!', pEvent.request) // 오프라인
            return response;
        }).catch(err => console.log(err))
    );
});