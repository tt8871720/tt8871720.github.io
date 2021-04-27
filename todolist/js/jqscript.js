$(function () {
    var $tagsGroup = $('.js-add-new-task').find('.tag'); // 所有的tag按鈕
    var $tagname = $('.tag:first').text(); //第一個tag為預設值
    var $inputtext, $time;
    var $listarray = []; //todolist(array)
    var $tagsnamearray = $.map($tagsGroup, function (item) {
        return $(item).text();
    }); //所有的tag(array)     
    var $nowtag; //選單的tag
    var $result = []; //篩選結果(array)
    var $todolistGroup; //所有list

    //儲存task
    function save() {
        //取得input內容後清空
        $inputtext = $('.js-input').val();
        $('.js-input').val('');
        $time = Number(new Date()); //轉為毫秒，並預設為id
        // console.log($time);
        //把object存進array
        $listarray.push({
            'id': $time,
            'tag': $tagname,
            'text': $inputtext
        });
        searchList($nowtag);
    }
    //篩選todolist
    function searchList(tag) {
        $('.js-todolist').empty();
        //若tag==all 不篩選直接印出
        tag = tag || "all";
        if (tag == "all") {
            $result = $listarray;
        } else {
            //tag!=all 篩選後再印出
            $result = $.grep($listarray, function (item) {
                return item.tag == tag;
            });
        }
        //無篩選結果,生成<p>
        if ($result.length < 1) {
            $('.js-todolist').append('<p style="color: rgb(170, 170, 170); margin: 0px 0px 1.5rem;">No task here...</p>');
        } else {
            //有篩選結果，生成<li>
            $.each($result, function (index, value) {
                $('.js-todolist').append(
                    $('<li class="js-inputHide" data-num="' + value.id + '">' +
                        '<div class="list-task">' +
                        '<i class="fas fa-check-circle done" aria-hidden="true"></i>' +
                        '<span class="list-tag ' + value.tag + '">' + value.tag + '</span>' +
                        '<span class="task-name js-task-name data-num="' + value.id + '">' + value.text + '</span>' +
                        '<input class="js-task-input" style="display:none;">' +
                        '</div>' +
                        '<div>' +
                        '<i class="fas fa-pen modify js-modify" data-num="' + value.id + '" aria-hidden="true" style="padding: 0.8rem;"></i>' +
                        '<i class="fas fa-trash delete js-delete" data-num="' + value.id + '" aria-hidden="true" style="padding: 0.8rem;"></i>' +
                        '</div>' +
                        '</li>'
                    )

                );
            });
        }
        //若超過一筆出現RemoveAll按鈕
        removebtnShow();

    }
    searchList();

    //若超過一筆出現RemoveAll按鈕
    function removebtnShow() {
        if ($result.length > 1) {
            $('.js-delete-all').css('display', 'inline-block');
        } else {
            $('.js-delete-all').css('display', 'none');
        }
    }
    //第一個tag為預設值
    $('.tag:first').addClass('tag-select');
    $tagsGroup.on('click', function (e) {
        //tag按鈕效果
        var $clicktag = $(this);
        $tagsGroup.removeClass('tag-select');
        $clicktag.addClass('tag-select');
        //取得tag的text
        $tagname = $clicktag.text();
        // console.log("目前tag:" + $tagname);
    });

    //點加號儲存
    $('.js-add').on('click', function () {
        save();
    });
    //按enter儲存
    $('.js-add-new-task').on('click keypress', function (e) {
        if (e.keyCode == 13) {
            $('.js-add').trigger('click');
        }
    });
    //載入下拉選單項目
    $.each($tagsnamearray, function (index, value) {
        $('.js-type-selector').append('<li class="option">' + value + '</li>');
    });
    //選單開合
    $('.js-chosen').on('click', function () {
        $('.type-selector').toggleClass('hide');
    });
    //點選option後下拉選單收合
    $('.js-type-selector').find('.option').on('click', function (e) {
        //取得選擇tagname
        $nowtag = $(this).text();
        //改變選單上文字
        $('.js-chosen').text($nowtag);
        // 呼叫篩選方法
        searchList($nowtag);
        $('.js-type-selector').addClass('hide');
        $('.js-info').text(""); //<p>不顯示文字
    });
    //勾選效果
    //當元素還未出現時，在'click'後可以指定'li'
    $('.js-todolist').on('click', 'li', function (e) {
        $(this).toggleClass('done-check');
    });
    //ReoveAll按鈕
    $('.js-removeAll').on('click', 'a', function (e) {
        $nowtag = $nowtag || "all";
        //$nowtag == all 全部刪除
        if ($nowtag == "all") {
            $('.js-info').text("Congratulations! No more task to do.");
            $listarray = []; //清空陣列   
            $('.js-todolist').empty();
        } else {
            //計算刪除數量
            var $times = $.grep($listarray, function (item, index) {
                return item.tag == $nowtag;
            });
            //依數量刪除
            for (var i = 0; i < $times.length; i++) {
                var $removeAllItem = $.grep($listarray, function (item, index) {
                    return item.tag == $nowtag;
                });
                $index = $.inArray($removeAllItem[0], $listarray);
                $listarray.splice($index, 1);                
            }
            searchList($nowtag);    //重整$('.js-todolist')
        }
        $('.js-delete-all').css('display', 'none');

    });
    //刪除按鈕
    $('.js-todolist').on('click', '.js-delete', function (e) {
        e.stopPropagation(); //阻止冒泡，只作用於點選範圍
        var $that = $(this);
        var $id = $that.data('num'); //取得此筆資料id
        var $deleteItem = $.grep($listarray, function (item, index) {
            return item.id == $id;
        }); //$.grep回傳array非object
        var $index = $.inArray($deleteItem[0], $listarray); //$deleteItem[0]為object
        $listarray.splice($index, 1);
        searchList($nowtag);

    });

    //修改按鈕
    $('.js-todolist').on('click', '.js-modify', function (e) {
        e.stopPropagation();
        var $that = $(this);
        var $li = $that.parents('li');
        var $isInputHide = $li.hasClass('js-inputHide'); // true 表示 input隱藏 span顯示
        var $taskName = $li.find('.js-task-name');
        var $taskInput = $li.find('.js-task-input');
        var $taskNameTxt, $taskInputVal;
        // 判斷 input目前狀態
        if ($isInputHide) {
            $taskNameTxt = $taskName.text();
            // 切換成 input顯示 span隱藏
            $taskName.hide();
            $taskInput.show();
            $taskInput.val($taskNameTxt);
            $li.removeClass('js-inputHide');
        } else {
            $taskInputVal = $taskInput.val();
            // 切換成 input隱藏 span顯示
            $taskInput.hide();
            $taskName.show();
            $taskName.text($taskInputVal);
            $li.addClass('js-inputHide');
            //修改object
            var $id = $that.data('num');
            var $Item = $.grep($listarray, function (item, index) {
                return item.id == $id;
            });
            $Item[0].text = $taskInputVal;
        }
    });
    //修改完後按Enter即可儲存
    $('.js-todolist').on('click keypress', '.js-task-input', function (e) {
        e.stopPropagation();
        var $that = $(this);
        var $li = $that.parents('li');
        if (e.keyCode == 13) {
            $li.find('.js-modify').trigger('click');
        }
    })
})