(function () {
	/* 单一文件上传「FORM-DATA」 */
	// 容器
	const container = document.querySelector('#upload1');
	// 选择文件的 input 框
	const uploadInput = container.querySelector('.upload_inp');
	// `选择文件`按钮
	const uploadSelect = container.querySelector('.upload_button.select');
	// `上传到服务器`按钮
	const uploadButton = container.querySelector('.upload_button.upload');
	// 提示信息
	const uploadTip = container.querySelector('.upload_tip');
	// 已选中的文件信息
	const uploadList = container.querySelector('.upload_list');
	// 已选文件
	let _file = null;

	// 监听`上传到服务器`事件
	uploadButton.addEventListener('click', function () {
		if (!_file) {
			alert('未选择任何文件!');
			return;
		}
		// TODO: 开始上传后:
		// 1. 禁止选择文件
		// 2. 上传到服务器显示 Loading..

		// 传递文件给服务器 FormData/Base64
		const fd = new FormData();
		fd.append('file', _file);
		fd.append('filename', _file.name);
		instance
			.post('/upload_single', fd)
			.then(data => {
				console.log(data);
				if (+data.code === 0) {
					console.log(`上传成功: ${data.servicePath}`);
					return;
				}
				return Promise.reject(data.codeText);  // 收到 200 但是没有成功的话, 跳到 catch 里。
			})
			.catch(reason => {
				// 所有失败的情况，都在 catch 里处理:
				//  1. 400+, 500+, ... 
				//  2. data.code !== 0 
				console.error(reason);
			})
			.finally(() => {
				clearFile();
			})

	}, false);

	// 监听`移除文件`事件
	uploadList.addEventListener('click', function (ev) {
		// 通过`事件委托`监听点击`移除`的操作
		// 优点:  
		//   1. 不需要每个 em 都绑一下，提升性能。
		const target = ev.target;  // target 是触发点击事件的元素，注意 currentTarget 是监听的元素
		if (!target) {
			return;
		}
		// 用户想要移除选中的文件
		if (target.tagName === 'EM') {
			clearFile();
		}
	}, false);

	// 监听`得到文件`事件
	uploadInput.addEventListener('change', function () {
		// files 是 FileList, 类数组集合
		// 得到选中的文件对象
		const file = uploadInput.files[0];
		if (!file) {
			return;
		}
		// 限制文件上传的格式
		if (!/png|jpg|jpeg/i.test(file.type)) {
			alert('上传格式不对!');
			return;
		}
		// 限制文件的大小, 单位: Byte
		if (file.size > 2 * 1024 * 1024) {
			alert('文件不能超过 2MB!');
			return;
		}
		console.log(file);
		_file = file;
		// 隐藏提示消息，显示已选中文件的信息
		handleSelectEvent(true);
	}, false);

	// 监听`选择文件`按钮的点击事件
	uploadSelect.addEventListener('click', function (e) {
		// 触发上传文件的 input 框的选择文件行为
		// 使用 addEventListener 的好处:
		//     1. 不影响别人，别人也不影响你
		uploadInput.click();
	}, false);


	// 选中/移除 文件
	function handleSelectEvent(isSelect) {
		uploadTip.style.display = isSelect ? 'none' : 'block';
		uploadList.style.display = isSelect ? 'block' : 'none';
		uploadList.innerHTML = isSelect ? `<li><span>文件：${_file ? _file.name : '..'}</span><span><em>移除</em></span></li>` : '';
	}

	function clearFile() {
		// 清除已选文件
		_file = null;
		// 移除显示已选文件的信息，显示提示消息
		handleSelectEvent(false);
	}
})();
