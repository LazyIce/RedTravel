import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less']
})

export class NavComponent {
  isActive: number;
  @Output() tabClicked = new EventEmitter<string>();

  constructor() {
    this.isActive = 0;
  }

  onActive(id: string) {
    if (id === 'all-tab') {
      this.isActive = 0;
    } else if (id === 'not-tab') {
      this.isActive = 1;
    } else {
      this.isActive = 2;
    }
    this.tabClicked.emit(id);
  }

  shareToSinaWB() {
    event.preventDefault();
    let _shareUrl = 'http://v.t.sina.com.cn/share/share.php?&appkey=895033136';
    _shareUrl += '&url=' + encodeURIComponent('http://www.baidu.com');
    _shareUrl += '&title=' + encodeURIComponent('红色足迹');
    _shareUrl += '&source=' + encodeURIComponent('');
    _shareUrl += '&sourceUrl=' + encodeURIComponent('');
    _shareUrl += '&content=' + 'utf-8';
    _shareUrl += '&pic=' + encodeURIComponent('');
    window.open(_shareUrl, '_blank', 'width=' + 600 + ',height=' + 600 + ',top=' + (screen.height - 600) / 2 + ',left=' + (screen.width - 600) / 2 + ',toolbar=no,menubar=no,scrollbars=no, resizable=1,location=no,status=0');
  }

  shareToQzone() {
    event.preventDefault();
    let _shareUrl = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?';
    _shareUrl += 'url=' + encodeURIComponent('www.baidu.com');
    _shareUrl += '&showcount=' + 0;
    _shareUrl += '&desc=' + encodeURIComponent('快来看看我的红色足迹吧');
    _shareUrl += '&summary=' + encodeURIComponent('我的红色足迹');
    _shareUrl += '&title=' + encodeURIComponent('红色足迹');
    _shareUrl += '&site=' + encodeURIComponent('');
    _shareUrl += '&pics=' + encodeURIComponent('');
    window.open(_shareUrl, '_blank', 'width=' + 600 + ',height=' + 600 + ',top=' + (screen.height - 600) / 2 + ',left=' + (screen.width - 600) / 2 + ',toolbar=no,menubar=no,scrollbars=no,resizable=1,location=no,status=0');
  }
}
