$(document).ready(function() {

    // 関数の中で使いたいので外で定義する
    let startTime;
    let stopTime = 0;
    let timeoutID;

    // jQueryを使ってHTML要素を取得する方法
    // getElementById()
    // jQueryオブジェクトを格納する変数には$をつける
    const $time = $("#time");
    const $buttonStart = $("#buttonStart");
    const $buttonStop = $("#buttonStop");
    const $buttonReset = $("#buttonReset");

    // 計測した時間を表示する
    function displayTime() {
        // 現在時刻から開始時間を引き、停止時間（経過時間）を足すことで経過時間を表示
        // 再開した時も、Date.now()とstartTimeは更新されるが、stopTimeは累積されていくため、停止直後の時間から始まる？
        const currentTime = new Date(Date.now() - startTime + stopTime);
        // ローカル時刻ではなく UTC（協定世界時）の時間を取得
        // データを文字列として保持
        const h = String(currentTime.getUTCHours());
        const m = String(currentTime.getUTCMinutes());
        const s = String(currentTime.getUTCSeconds());
        // ミリ秒は常に3桁表示で取得する。また、一度三桁表示させないとうまく一桁目を表示できない。
        const ms = String(currentTime.getUTCMilliseconds()).padStart(3, '0').slice(0, 1); // ミリ秒を一桁にする;
        
        $time.text(`${h}:${m}:${s}:${ms}`);
        timeoutID = setTimeout(displayTime, 10); // 1秒後に繰り返す(1000ms*10)
        // setInterval()だと前の処理が完了する前に次の処理を開始する可能性がある？
    }
    // on→一回の処理で複数のイベントを設定できる
    // 補）onの代わりにaddEventListenerを使うと、同じ名前のイベントを書いても上書きされない
    $buttonStart.on("click", function() {
        startTime = Date.now();
        displayTime();

        // jQueryではpropを用いてdisabledプロパティを有効・無効にする
        $buttonStart.prop("disabled", true);
        $buttonStop.prop("disabled", false);
        $buttonReset.prop("disabled", false);
    });

    $buttonStop.on("click", function() {
        clearTimeout(timeoutID); // 繰り返しの停止
        stopTime += (Date.now() - startTime);

        $buttonStart.prop("disabled", false);
        $buttonStop.prop("disabled", true);
        $buttonReset.prop("disabled", false);
    });

    $buttonReset.on("click", function() {
        $time.text("0:0:0:0"); // 表示のリセット（テキストの上書き）
        clearTimeout(timeoutID); // これを入れないとスタート→リセットを押した時、カウントが止まらない
        $buttonStart.prop("disabled", false);
        $buttonStop.prop("disabled", true);
        $buttonReset.prop("disabled", true);
        stopTime = 0;
    });


});

// 参考（https://tcd-theme.com/2022/06/javascript-stopwatch.html）