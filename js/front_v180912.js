// JavaScript Document
'use strict';

$(document).on('click', 'a[href="#"]', function(e) {
    e.preventDefault();
});

$(document).ready(function() {

    // Navbar 프로필 탭 클릭
    navMenu();
    function navMenu() {
        $('.account li.profile > a').on('click', function(e) {
            e.preventDefault();
            $(this).parent().toggleClass('dropdown');
        });
        $('.account li a').on('click', function(e) {
            e.stopPropagation();
        });
        $(document).on('click', function() {
            $('.account li.profile').removeClass('dropdown');
        });
    } // end of navMenu

    // Sidebar menu (iscroll 사용)
    sideMenu();
    function sideMenu() {
        var myScroll = '';
    
        $('.menu > li').each(function() {
            if ($(this).find('li').length > 0) {
                $(this).find('> a').append('<i class="fas fa-angle-right arrow"></i>');
            }
        });
        setTimeout(function() {
            myScroll = applyIScroll('.sidebar-menu');
        }, 300);
        $('.menu > li > a').on('click', function() {
            if ($(this).parent().hasClass('open')) {
                $(this).parent().find('> ul').css({'height': 0});
                $(this).parent().removeClass('open');
            } else {
                var height = 0;
                $(this).parent().find('> ul > li').each(function() {
                    height += $(this).outerHeight();
                });
                $(this).parent().find('> ul').css({'height': height});
                $(this).parent().addClass('open');
            }
            setTimeout(function() {myScroll.refresh();}, 200);
        }); // end of click
        var timerId = '';
        $('.sidebar-menu').on('mouseenter', function() {
            clearTimeout(timerId);
        }).on('mouseleave', function() {
            timerId = setTimeout(function() {
                $('.menu > li > ul').css({'height': 0});
                $('.menu > li').removeClass('open');
            }, 300);
            setTimeout(function() {myScroll.refresh(); myScroll.scrollTo(0, 0);}, 300);
        }); // end of mouseleave

        function applyIScroll(selector) {
            var myScroll = new IScroll(selector, {
                snap: false,
                click: true,
                mouseWheel: true,
                scrollbars: true,
                fadeScrollbars: true,
                interactiveScrollbars: true,
                resizeScrollbars: true,
                shrinkScrollbars: 'scale',
                scrollX: false,
                scrollY: true
            });
            return myScroll;  // 해당 iScroll 객체를 리턴
        } // end of applyIScroll
    } // end of sideMenu

    // Sidebar toggle
    sideMenuToggle();
    function sideMenuToggle() {
        $('.util-icon li a.toggle').on('click', function() {
            $('.sidebar .sidebar-menu').toggleClass('folded');
            $('.page').toggleClass('expand');
        });
    } // end of sideMenuToggle 
    
    // Calendar용 메소드 (Air-Datepicker 사용 / IE10 이상)  
    $.fn.setDatePicker = function(options) {
        if (this.length < 1) return false;

        var that = this;
        
        // 캘린더 버튼 동작(추가)
        that.next().on('click', function() {
            $(this).prev().focus(); // 뒤에 것을 선택하면 앞에 걸로 포커스가 가게 설정
        });
        
        // 형태(날짜, 월, 연도, 시간)별 세팅
        if (that.attr('class').indexOf('date') !== -1) {
            that.attr({'maxlength': 10});
        } else if (that.attr('class').indexOf('month') !== -1) {
            that.attr({'maxlength': 7, 'data-min-view': 'months', 'data-view': 'months', 'data-date-format': 'yyyy-mm'});
        } else if (that.attr('class').indexOf('year') !== -1) {
            that.attr({'maxlength': 4, 'data-min-view': 'years', 'data-view': 'years', 'data-date-format': 'yyyy'});
        } else if (that.attr('class').indexOf('datetime') !== -1) {
            that.attr({'maxlength': 16, 'data-timepicker': 'true', 'data-time-format': 'hh:ii'});
        } else if (that.attr('class').indexOf('datehour') !== -1) {
            that.attr({'maxlength': 16, 'data-timepicker': 'true', 'data-time-format': 'hh:00'});
        }

        // air-datepicker 적용
        var date = new Date();
        that.datepicker({
            language: 'en',
            autoClose: true,
            startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate(), '00', '00'),  // 시간, 분은 00으로 초기 설정 // 달력을 오늘 날짜로 셋팅
            minutesStep: 30 // 분 단위
            //minDate: new Date()
        });

        // 자동포맷 적용
        that.on('keyup', function(e) {
            // backspace이면 동작하지 않음(수정시)
            if (e.keyCode === 8) return false;

            var maxLength = Number($(this).attr('maxlength'));
            var text = $(this).val();
            var pattern = /[^\d]/g;  // 입력허용값(숫자만)
            var newText = text.replace(pattern, '');  // 숫자이외의 기호는 없앰
            var newTextLength = newText.length;
            // Dash 자동 삽입
            if (newTextLength > 4) {
                newText = newText.slice(0, 4) + '-' + newText.slice(4);
            }
            if (newTextLength > 6){
                newText = newText.slice(0, 7) + '-' + newText.slice(7);
            }
            if (newTextLength > 8){
                newText = newText.slice(0, 10) + ' ' + newText.slice(10);
            }
            if (newTextLength > 10){
                newText = newText.slice(0, 13) + ':' + newText.slice(13);
            }
            // 최대값을 넘는 경우 삭제
            if (newText.length > maxLength) {
                newText = newText.slice(0, maxLength);
            }
            // 반영
            $(this).val(newText);  // 현재 요소만
        });
    };  // end of calender method

    // 월 달력 적용
    $('#date1, #date2').setDatePicker();
    // 일/시간 달력 적용
    $('#datetime1, #datetime2').setDatePicker();
    
})// ready
