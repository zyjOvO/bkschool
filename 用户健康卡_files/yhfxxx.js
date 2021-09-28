define(function (require, exports, module) {
    var tpl = require('text!mobile/yhfxxx/yhfxxx.html?v=20210916');
    return function () {
        var page = {
            template: tpl,
            components: {},
            data: function () {
                return {
                    qrcode: null,
                    color: '',
                    qrcodeDatetime: '',
                    jkxxFields: ['CQWYQFKZDDQ', 'JCGYQFKZDDQGWRY', 'JCGYSHQZBL', 'MQJSJJGC', 'JSJJGCSJ', 'MQJSJTGC', 'JSJTGCSJ', 'JWFHTJGJ', 'WZZGRZ'],
                    //学生
                    isStudent: false,
                    xsSchedule: '',
                    xsjkxxModel: [],
                    xsfxxxModel: [],
                    xscxxxModel: [],
                    xslsfxxxModel: [],
                    xsjkxx: {},
                    xsfxxx: {},
                    xsfxxxConfirm: {},
                    canDisabled: false,
                    feedbackPopupShow: false,
                    xscxxx: {},
                    xslsfxxx: {},
                    xslscxbbShow: false,
                    xsjcxyqsqShow: false,
                    xslssqShow: false,
                    xsReportOverdue: false,
                    xsjkmxx: {},
                    isXsWlry: false,
                    //教职工
                    isTeacher: false,
                    jzgjkxxModel: [],
                    jzgfxxxModel: [],
                    jzgjkxx: {},
                    jzgfxxx: {},
                    jzglsjxbbShow: false,
                    hqryrxbbShow: false,
                    isWlry: false,
                    wlry: {},
                    wlryModel: WIS_EMAP_SERV.convertModel([{
                        caption: '对接人',
                        dataType: 'String',
                        groupName: '外来人员信息',
                        name: 'DJR',
                        xtype: 'text'
                    }, {
                        caption: '对接部门',
                        dataType: 'String',
                        groupName: '外来人员信息',
                        name: 'DJBM',
                        xtype: 'text'
                    }], 'form'),
                    jzgReportOverdue: false,
                    jzgjkmxx: {},
                    rightIcon: '<i class="mint-icon mint-icon-checked iconfont icon-wancheng mt-color-primary"></i>',
                    errorIcon: '<i class="mint-icon mint-icon-checked iconfont icon-weiwancheng mt-color-danger"></i>',
                    cph: {},
                    cphModel: WIS_EMAP_SERV.convertModel([{
                        caption: '车牌号',
                        dataType: 'String',
                        groupName: '车辆信息',
                        name: 'CPH',
                        xtype: 'text'
                    }], 'form')
                };
            },
            created: function () {
                SDK.setTitleText('我的返校信息');
                if (USER_INFO.userType == 'STUDENT') {
                    this.xsjkxxModel = WIS_EMAP_SERV.getModel('/mobile/yhfxxx.do', 'getXsjkxxData', 'form');
                    this.isStudent = true;
                    this.loadStudent();
                } else {
                    this.jzgjkxxModel = WIS_EMAP_SERV.getModel('/mobile/yhfxxx.do', 'getJzgjkxxData', 'form');
                    // this.jzgfxxxModel = WIS_EMAP_SERV.getModel('/mobile/yhfxxx.do', 'getJzgfxxxData', 'form');
                    this.isTeacher = true;
                    this.loadTeacher();
                }
            },
            mounted: function () {},
            methods: {
                getUserInfo: function () {
                    return {
                        USER_ID: USERID,
                        USER_NAME: USER_INFO.userName
                    };
                },
                handleJkxx: function (report, reportOverdue, ref, jkxx) {
                    var self = this;
                    self.$nextTick(function () {
                        if (report) {
                            if (reportOverdue) {
                                self.$refs[ref].hideItem(self.jkxxFields);
                            } else {
                                $.each(self.jkxxFields, function () {
                                    if (!jkxx[this]) {
                                        self.$refs[ref].hideItem(this.toString());
                                    } else {
                                        self.$refs[ref].showItem(this.toString());
                                    }
                                });
                            }
                        } else {
                            self.$refs[ref].showItem(self.jkxxFields);
                        }
                    });
                },
                loadTop: function () {
                    var self = this;
                    var callback = function () {
                        self.$refs.loadmore.onTopLoaded();
                    }
                    if (self.isStudent) {
                        self.loadStudent(callback);
                    } else {
                        self.loadTeacher(callback);
                    }
                },
                loadStudent: function (callback) {
                    var self = this;
                    MOB_UTIL.Post('../yhfxxx/getStudentInfo.do').done(function (result) {
                        if (result && '0' == result.code) {
                            //健康信息
                            var tempXsjkxx = self.getUserInfo();
                            $.extend(tempXsjkxx, result.datas.xsjkxx);
                            self.xsjkxx = tempXsjkxx;
                            self.xsReportOverdue = result.datas.reportOverdue;
                            self.handleJkxx(result.datas.report, result.datas.reportOverdue, 'xsjkxxForm', self.xsjkxx);
                            self.$nextTick(function () {
                                self.$refs.xsjkxxForm[$.trim(self.xsjkxx.ZSXQ) != '' ? 'showItem' : 'hideItem']('ZSXQ');
                            });
                            self.isXsWlry = result.datas.wlry;
                            //车牌号
                            self.cph.CPH = result.datas.cph || '';
                            //时间信息
                            self.xsfxxx = result.datas.xsfxxx || {};
                            self.xsfxxxConfirm = result.datas.xsfxxxConfirm || {};
                            self.xscxxx = result.datas.xscxxx || {};
                            self.xslsfxxx = result.datas.xslsfxxx || {};
                            self.xsjkmxx = result.datas.xsjkmxx || {};
                            var color = result.datas.color;
                            var schedule = result.datas.schedule;
                            var time = result.datas.time;
                            var now = self.formatDateTime(time);
                            if (schedule == '1') {
                                // self.xsfxxxModel = WIS_EMAP_SERV.getModel('/mobile/yhfxxx.do', 'getXsfxxxData', 'form');
                                self.canDisabled = self.xsfxxxConfirm.SFASFX == '1';
                                self.xslscxbbShow = self.xsfxxx.FXKSSJ !== undefined && (now >= self.xsfxxx.FXKSSJ);
                                self.xslssqShow = self.xsfxxx.FXJSSJ !== undefined && (now >= self.xsfxxx.FXJSSJ);
                            } else if (schedule == '2') {
                                self.xscxxxModel = WIS_EMAP_SERV.getModel('/mobile/yhfxxx.do', 'getXscxxxData', 'form');
                                if (color == '3') {
                                    if (self.xscxxx.wtxstxsj == true) {
                                        color = '4';
                                    } else {
                                        color = '5';
                                    }
                                }
                                self.xslscxbbShow = true;
                                self.xslssqShow = true;
                            } else if (schedule == '3') {
                                // self.xslsfxxxModel = WIS_EMAP_SERV.getModel('/mobile/yhfxxx.do', 'getXslsfxxxData', 'form');
                                self.xslscxbbShow = true;
                                self.xslssqShow = false;
                            } else {
                                self.xslscxbbShow = false;
                                self.xslssqShow = true;
                            }
                            color = self.convertColor(color);
                            self.xsSchedule = schedule;
                            self.color = color;
                            self.$nextTick(function () {
                                self.showQRCode(color, time);
                                if (callback) {
                                    callback();
                                }
                            });
                            self.xsjcxyqsqShow = !($.isEmptyObject(self.xsfxxx) && $.isEmptyObject(self.xscxxx) && $.isEmptyObject(self.xslsfxxx));
                            self.showImage();
                        } else {
                            mintUI.MessageBox('错误', '获取信息异常，请重试或联系管理员');
                        }
                    });
                },
                loadTeacher: function (callback) {
                    var self = this;
                    MOB_UTIL.Post('../yhfxxx/getTeacherInfo.do').done(function (result) {
                        if (result && '0' == result.code) {
                            //健康信息
                            var tempJzgjkxx = self.getUserInfo();
                            $.extend(tempJzgjkxx, result.datas.jzgjkxx);
                            self.jzgjkxx = tempJzgjkxx;
                            self.jzgReportOverdue = result.datas.reportOverdue;
                            self.handleJkxx(result.datas.report, result.datas.reportOverdue, 'jzgjkxxForm', self.jzgjkxx);
                            //外来人员
                            self.isWlry = result.datas.wlry;
                            self.wlry = result.datas.wlryxx || {};
                            if (self.isWlry) {
                                self.$nextTick(function () {
                                    self.$refs['jzgjkxxForm'].hideItem('STJKZK');
                                    self.$refs['jzgjkxxForm'].hideItem(self.jkxxFields);
                                });
                            } else {
                                self.$nextTick(function () {
                                    self.$refs['jzgjkxxForm'].showItem('STJKZK');
                                });
                            }
                            var rxbbFlag = ['902', '914', '908', '913', '917'].indexOf(USER_INFO.deptCode) == -1;
                            self.jzglsjxbbShow = rxbbFlag;
                            self.hqryrxbbShow = !rxbbFlag;
                            //车牌号
                            self.cph.CPH = result.datas.cph || '';
                            //时间信息
                            self.jzgfxxx = result.datas.jzgfxxx || {};
                            self.jzgjkmxx = result.datas.jzgjkmxx || {};
                            var color = result.datas.color;
                            var time = result.datas.time;
                            color = self.convertColor(color);
                            self.color = color;
                            self.$nextTick(function () {
                                self.showQRCode(color, time);
                                if (callback) {
                                    callback();
                                }
                            });
                        } else {
                            mintUI.MessageBox('错误', '获取信息异常，请重试或联系管理员');
                        }
                    });
                },
                goXsjkxxbs: function () {
                    window.open(WIS_EMAP_SERV.getContextPath() + '/sys/szptpubxsjkxxbs/*default/index.do?' + $.param({
                        nodeId: 0,
                        taskId: 0,
                        processInstanceId: 0,
                        instId: 0,
                        defId: 0,
                        defKey: 0
                    }));
                },
                goXsjkmsq: function () {
                    window.open(WIS_EMAP_SERV.getContextPath() + '/sys/szptpubxsgrjkmjxcktb/*default/index.do?' + $.param({
                        nodeId: 0,
                        taskId: 0,
                        processInstanceId: 0,
                        instId: 0,
                        defId: 0,
                        defKey: 0
                    }));
                },
                goCjkxfxbb: function () {
                    window.open(WIS_EMAP_SERV.getContextPath() + '/sys/szptpubxslsfxbb/*default/index.do?' + $.param({
                        nodeId: 0,
                        taskId: 0,
                        processInstanceId: 0,
                        instId: 0,
                        defId: 0,
                        defKey: 0
                    }));
                },
                goXslscxbb: function () {
                    window.open(WIS_EMAP_SERV.getContextPath() + '/sys/szptpubxslscxbb/*default/index.do?' + $.param({
                        nodeId: 0,
                        taskId: 0,
                        processInstanceId: 0,
                        instId: 0,
                        defId: 0,
                        defKey: 0
                    }));
                },
                goXsjcxyqsq: function () {
                    window.open(WIS_EMAP_SERV.getContextPath() + '/sys/szptpubxsjcxyqsq/*default/index.do?' + $.param({
                        nodeId: 0,
                        taskId: 0,
                        processInstanceId: 0,
                        instId: 0,
                        defId: 0,
                        defKey: 0
                    }));
                },
                goXslssq: function () {
                    window.open(WIS_EMAP_SERV.getContextPath() + '/sys/szptpubxslssq/*default/index.do?' + $.param({
                        nodeId: 0,
                        taskId: 0,
                        processInstanceId: 0,
                        instId: 0,
                        defId: 0,
                        defKey: 0
                    }));
                },
                goJzgjkxxbs: function () {
                    window.open(WIS_EMAP_SERV.getContextPath() + '/sys/szptpubjzgjkxxbs/*default/index.do?' + $.param({
                        nodeId: 0,
                        taskId: 0,
                        processInstanceId: 0,
                        instId: 0,
                        defId: 0,
                        defKey: 0
                    }));
                },
                goJzgjkmsq: function () {
                    window.open(WIS_EMAP_SERV.getContextPath() + '/sys/lwszptjzgjkmsq/mobile/index.do?_id=20150808183545466#/mapply');
                },
                goHqryjkmsq: function () {
                    window.open(WIS_EMAP_SERV.getContextPath() + '/sys/lwszpthqryjkmsq/mobile/index.do#/mapply');
                },
                goJzglsjxbb: function () {
                    var result = WIS_EMAP_SERV.doSyncAjax('../yhfxxx/getJzgTbCount.do', null, 'GET');
                    mintUI.MessageBox.confirm('临时进校报备需要近' + result.datas + '天健康数据更新。').then(function (action) {
                        window.open(WIS_EMAP_SERV.getContextPath() + '/sys/szptpubjzglsjxbb/mobile/index.html');
                    });
                },
                goHqryrxbb: function () {
                    var result = WIS_EMAP_SERV.doSyncAjax('../yhfxxx/getJzgTbCount.do', null, 'GET');
                    mintUI.MessageBox.confirm('入校报备需要近' + result.datas + '天健康数据更新。').then(function (action) {
                        window.open(WIS_EMAP_SERV.getContextPath() + '/sys/szptpubhqryrxbb/mobile/index.html');
                    });
                },
                goLsba: function () {
                    window.open(WIS_EMAP_SERV.getContextPath() + '/sys/szptpubjzglsba/mobile/index.html');
                },
                selectCan: function () {
                    var self = this;
                    mintUI.MessageBox.confirm('是否选择按时返校？').then(function () {
                        MOB_UTIL.Post('../yhfxxx/selectCan.do').done(function (result) {
                            if (result && result.code == '0' && result.datas == 1) {
                                self.xsfxxxConfirm.SFASFX = '1';
                                self.canDisabled = true;
                                mintUI.Toast('选择按时返校成功');
                            } else {
                                mintUI.MessageBox('错误', result.msg);
                            }
                        });
                    });
                },
                showFeedback: function () {
                    var self = this;
                    self.feedbackPopupShow = true;
                    var result = WIS_EMAP_SERV.doSyncAjax('../yhfxxx/getFeedback.do');
                    if (result.code != '0') {
                        mintUI.Indicator.close();
                        self.feedbackPopupShow = false;
                        mintUI.MessageBox('错误', '获取信息异常，请重试或联系管理员');
                        return;
                    }
                    mintUI.Indicator.open();
                    self.$nextTick(function () {
                        self.$refs.feedbackTextarea.currentValue = result.datas || '';
                        mintUI.Indicator.close();
                    });
                },
                selectCannot: function () {
                    var self = this;
                    var value = self.$refs.feedbackTextarea.currentValue;
                    if ($.trim(value) == '') {
                        mintUI.Toast('反馈信息不为空白');
                        return;
                    }
                    var content = self.xsfxxxConfirm.SFASFX == '0' ? '修改反馈信息' : '选择无法按时返校';
                    mintUI.MessageBox.confirm('是否' + content + '?').then(function () {
                        MOB_UTIL.Post('../yhfxxx/selectCannot.do', {
                            WFASFXFKXX: value,
                        }).done(function (result) {
                            if (result && result.code == '0' && result.datas == 1) {
                                self.xsfxxxConfirm.SFASFX = '0';
                                self.canDisabled = false;
                                self.feedbackPopupShow = false;
                                mintUI.Toast(content + '成功');
                            } else {
                                mintUI.MessageBox('错误', result.msg);
                            }
                        });
                    });
                },
                showQRCode: function (color, time) {
                    var url = WIS_CONFIG.HOST_PATH + '/sys/szptpubjkkck/mobile.do';
                    url += '?' + $.param({
                        param: USERID + ',' + time
                    });
                    if (this.qrcode == null) {
                        var qrcode = new QRCode(document.getElementById('qrcode'), {
                            text: url,
                            colorDark: color || '#000000'
                        });
                        this.qrcode = qrcode;
                    } else {
                        this.qrcode._htOption.colorDark = color || '#000000';
                        this.qrcode.clear();
                        this.qrcode.makeCode(url);
                    }
                    this.qrcodeDatetime = this.formatDateTime(time);
                },
                formatDateTime: function (inputTime) {
                    var date = new Date(inputTime);
                    var y = date.getFullYear();
                    var m = date.getMonth() + 1;
                    m = m < 10 ? ('0' + m) : m;
                    var d = date.getDate();
                    d = d < 10 ? ('0' + d) : d;
                    var h = date.getHours();
                    h = h < 10 ? ('0' + h) : h;
                    var minute = date.getMinutes();
                    var second = date.getSeconds();
                    minute = minute < 10 ? ('0' + minute) : minute;
                    second = second < 10 ? ('0' + second) : second;
                    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
                },
                formatDate: function (inputTime) {
                    var date = new Date(inputTime);
                    var y = date.getFullYear();
                    var m = date.getMonth() + 1;
                    m = m < 10 ? ('0' + m) : m;
                    var d = date.getDate();
                    d = d < 10 ? ('0' + d) : d;
                    return y + '-' + m + '-' + d;
                },
                convertColor: function (color) {
                    if (color == '1') {
                        return '#F26666';
                    } else if (color == '2') {
                        return '#FFB950';
                    } else if (color == '3') {
                        return '#A2D06B';
                    } else if (color == '4') {
                        return '#4A90E2';
                    } else if (color == '5') {
                        return '#D98BE8';
                    }
                },
                getDeptNameStyle: function (value) {
                    if (value == '校外人员') {
                        return {
                            color: '#F26666',
                            'font-weight': 'bold',
                            'font-size': '16px'
                        };
                    } else {
                        return {};
                    }
                },
                getZsxqStyle: function (value) {
                    if (value == '旺棠公寓') {
                        return {
                            color: '#F26666',
                            'font-weight': 'bold',
                            'font-size': '16px'
                        };
                    } else {
                        return {};
                    }
                },
                logout: function () {
                    window.location.href = 'https://ehall.szpt.edu.cn/amp-auth-adapter/logout?service=' + encodeURIComponent(location.origin + location.pathname + "?" + $.param({
                        nodeId: 0,
                        taskId: 0,
                        processInstanceId: 0,
                        instId: 0,
                        defId: 0,
                        defKey: 0
                    }));
                },
                showImage: function () {
                    this.$nextTick(function () {
                        var $form;
                        if (this.isStudent) {
                            $form = $(this.$refs.xsjkxxForm.$el);
                        } else if (this.isTeacher) {
                            $form = $(this.$refs.jzgjkxxForm.$el);
                        }
                        if ($form.find('img[alt="用户照片"]').length == 0) {
                            var $item = $form.find('.emapm-items:eq(0)');
                            $item.find('.mint-cell-group').css('background-color', 'white').append('<div style="clear: both;"></div>');
                            $item.find('.mint-cell-group-content').css('margin-right', '148px');
                            $item.find('.mint-cell-group-title').after('<img src="../yhfxxx/getUserImage.do" alt="用户照片" style="width: 128px;height: auto;float: right;margin-right: 20px;">');
                        }
                    });
                },
                decode: function () {
                    for (var i = 1; i < arguments.length; i = i + 2) {
                        if (arguments[0] == arguments[i]) {
                            return arguments[i + 1];
                        }
                    }
                    return arguments[arguments.length - 1];
                }
            },
            computed: {
                greenCode: function () {
                    if (this.color == '#A2D06B') {
                        return '#A2D06B';
                    } else if (this.color == '#4A90E2') {
                        return '#4A90E2';
                    } else if (this.color == '#D98BE8') {
                        return '#D98BE8';
                    } else {
                        return '';
                    }
                }
            },
        };
        return page;
    };
});