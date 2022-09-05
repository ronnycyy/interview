/* 单文件上传 「FORM-DATA」 */
(function () {
	// 容器
	const uploadContainer = document.querySelector('#upload1');
	// 选择文件的 input 框
	const uploadInput = uploadContainer.querySelector('.upload_inp');
	// `选择文件`按钮
	const uploadSelect = uploadContainer.querySelector('.upload_button.select');
	// `上传到服务器`按钮
	const uploadButton = uploadContainer.querySelector('.upload_button.upload');
	// 提示信息
	const uploadTip = uploadContainer.querySelector('.upload_tip');
	// 已选中的文件信息
	const uploadList = uploadContainer.querySelector('.upload_list');
	// 已选文件
	let _file = null;

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
			clearSelectedFile();
		}
	}, false);

	// 监听`选择文件`按钮的点击事件
	uploadSelect.addEventListener('click', function (e) {
		if (uploadSelect.classList.contains('disable')) {
			return;
		}
		// 触发上传文件的 input 框的选择文件行为
		// 使用 addEventListener 的好处:
		//     1. 不影响别人，别人也不影响你
		uploadInput.click();
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

	// 监听`上传到服务器`事件
	uploadButton.addEventListener('click', function () {
		if (uploadButton.classList.contains('loading')) {
			return;
		}
		if (!_file) {
			alert('未选择任何文件!');
			return;
		}
		// 开始上传后, 所有按钮置为灰色:
		//   1. 选择文件按钮 disable
		//   2. 上传到服务器按钮 loading
		handleDisable(true);

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
				// 结束上传，恢复状态
				clearSelectedFile();
				handleDisable(false);
			})
	}, false);

	// 选中/移除 文件
	function handleSelectEvent(isSelect) {
		uploadTip.style.display = isSelect ? 'none' : 'block';
		uploadList.style.display = isSelect ? 'block' : 'none';
		uploadList.innerHTML = isSelect ? `<li><span>文件：${_file ? _file.name : '..'}</span><span><em>移除</em></span></li>` : '';
	}

	// 按钮是否处于不可操作状态 (比如，正在上传文件...)
	function handleDisable(isDisable) {
		if (isDisable) {
			uploadButton.classList.add('loading');
			uploadSelect.classList.add('disable');
			return;
		}
		uploadSelect.classList.remove('disable');
		uploadButton.classList.remove('loading');
	}

	// 清除已选文件
	function clearSelectedFile() {
		_file = null;
		// 移除显示已选文件的信息，显示提示消息
		handleSelectEvent(false);
	}
})();

/* 单文件上传 「BASE64」 */
(function () {
	// 容器
	const uploadContainer = document.querySelector('#upload2');
	// 选择文件的 input 框
	const uploadInput = uploadContainer.querySelector('.upload_inp');
	// `选择文件`按钮
	const uploadSelect = uploadContainer.querySelector('.upload_button.select');
	// 已选文件
	let _file = null;

	// 监听`选择文件`按钮的点击事件
	uploadSelect.addEventListener('click', function (e) {
		if (uploadSelect.classList.contains('disable')) {
			return;
		}
		// 触发上传文件的 input 框的选择文件行为
		// 使用 addEventListener 的好处:
		//     1. 不影响别人，别人也不影响你
		uploadInput.click();
	}, false);

	// 监听`得到文件`事件
	uploadInput.addEventListener('change', async function () {
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

		uploadSelect.classList.add('loading');

		try {
			const base64Url = await fileToBase64(file);
			const data = await instance.post('/upload_single_base64', {
				file: encodeURIComponent(base64Url),
				filename: file.name
			}, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});

			if (+data.code === 0) {
				console.log('base64上传成功!', data.servicePath);
			}
			else {
				throw new Error(data.codeText);
			}
		}
		catch (e) {
			console.error(e);
		}
		finally {
			uploadSelect.classList.remove('loading');
		}
	}, false);

	function fileToBase64(file) {
		return new Promise((resolve, reject) => {
			const fr = new FileReader();
			fr.onload = function (ev) {
				resolve(ev.target.result);
			}
			fr.onerror = function (err) {
				reject(err);
			}
			fr.readAsDataURL(file);
		});
	}

	// 选中/移除 文件
	function handleSelectEvent(isSelect) {
		uploadTip.style.display = isSelect ? 'none' : 'block';
		uploadList.style.display = isSelect ? 'block' : 'none';
		uploadList.innerHTML = isSelect ? `<li><span>文件：${_file ? _file.name : '..'}</span><span><em>移除</em></span></li>` : '';
	}

	// 按钮是否处于不可操作状态 (比如，正在上传文件...)
	function handleDisable(isDisable) {
		if (isDisable) {
			uploadButton.classList.add('loading');
			uploadSelect.classList.add('disable');
			return;
		}
		uploadSelect.classList.remove('disable');
		uploadButton.classList.remove('loading');
	}

	// 清除已选文件
	function clearSelectedFile() {
		_file = null;
		// 移除显示已选文件的信息，显示提示消息
		handleSelectEvent(false);
	}
})();

/* 文件缩略图 & 自动生成名字 */
(function () {
	// 容器
	const uploadContainer = document.querySelector('#upload3');
	// 选择文件的 input 框
	const uploadInput = uploadContainer.querySelector('.upload_inp');
	// `选择文件`按钮
	const uploadSelect = uploadContainer.querySelector('.upload_button.select');
	// `上传到服务器`按钮
	const uploadButton = uploadContainer.querySelector('.upload_button.upload');
	// `缩略图`盒子
	const uploadAbbr = uploadContainer.querySelector('.upload_abbre');
	// `缩略图`图片
	const uploadAbbrImg = uploadAbbr.querySelector('img');
	// 已选中的文件
	let _file = null;

	// 监听`选择文件`按钮的点击事件
	uploadSelect.addEventListener('click', function (e) {
		if (uploadSelect.classList.contains('disable')) {
			return;
		}
		uploadInput.click();
	}, false);

	// 监听`得到文件`事件
	uploadInput.addEventListener('change', async function () {
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
		// if (file.size > 2 * 1024 * 1024) {
		// 	alert('文件不能超过 2MB!');
		// 	return;
		// }
		_file = file;
		// 文件预览
		uploadSelect.classList.add('disable');
		const base64Url = await fileToBase64(file);
		uploadAbbr.style.display = 'block';
		uploadAbbrImg.src = base64Url;
		uploadSelect.classList.remove('disable');
	}, false);

	// 监听`上传到服务器`事件
	uploadButton.addEventListener('click', async function () {
		if (uploadButton.classList.contains('loading')) {
			return;
		}
		if (!_file) {
			alert('未选择任何文件!');
			return;
		}
		handleDisable(true);

		const { filename } = await fileToBuffer(_file);

		// 传递文件给服务器 FormData/Base64
		const fd = new FormData();
		fd.append('file', _file);
		fd.append('filename', filename);
		instance
			.post('/upload_single_name', fd)
			.then(data => {
				console.log(data);
				if (+data.code === 0) {
					console.log(`上传成功: ${data.servicePath}`);
					return;
				}
				return Promise.reject(data.codeText);  // 收到 200 但是没有成功的话, 跳到 catch 里。
			})
			.catch(reason => {
				console.error(reason);
			})
			.finally(() => {
				_file = null;
				uploadAbbrImg.src = '';
				uploadAbbr.style.display = 'none';
				handleDisable(false);
			})
	}, false);

	function fileToBuffer(file) {
		return new Promise((resolve, reject) => {
			const fr = new FileReader();
			fr.onload = function (ev) {
				const buffer = ev.target.result;
				const spark = new SparkMD5.ArrayBuffer();
				spark.append(buffer);
				const hash = spark.end();
				const suffix = /\.([a-zA-Z0-9]+)$/.exec(file.name)[1];
				resolve({
					buffer: buffer,
					HASH: hash,
					suffix: suffix,
					filename: `${hash}.${suffix}`
				});
			}
			fr.onerror = function (err) {
				reject(err);
			}
			fr.readAsArrayBuffer(file);
		});
	}

	function fileToBase64(file) {
		return new Promise((resolve, reject) => {
			const fr = new FileReader();
			fr.onload = function (ev) {
				resolve(ev.target.result);
			}
			fr.onerror = function (err) {
				reject(err);
			}
			fr.readAsDataURL(file);
		});
	}

	// 按钮是否处于不可操作状态 (比如，正在上传文件...)
	function handleDisable(isDisable) {
		if (isDisable) {
			uploadButton.classList.add('loading');
			uploadSelect.classList.add('disable');
			return;
		}
		uploadSelect.classList.remove('disable');
		uploadButton.classList.remove('loading');
	}
})();

/* 进度管控 */
(function () {
	// 容器
	const uploadContainer = document.querySelector('#upload4');
	// 选择文件的 input 框
	const uploadInput = uploadContainer.querySelector('.upload_inp');
	// `选择文件`按钮
	const uploadSelect = uploadContainer.querySelector('.upload_button.select');
	// `缩略图`盒子
	const uploadProgress = uploadContainer.querySelector('.upload_progress');
	// `缩略图`图片
	const uploadProgressValue = uploadProgress.querySelector('.value');

	// 监听`选择文件`按钮的点击事件
	uploadSelect.addEventListener('click', function (e) {
		if (uploadSelect.classList.contains('disable')) {
			return;
		}
		uploadInput.click();
	}, false);

	// 监听`得到文件`事件
	uploadInput.addEventListener('change', async function () {
		const file = uploadInput.files[0];
		if (!file) {
			return;
		}
		// if (!/png|jpg|jpeg/i.test(file.type)) {
		// 	alert('上传格式不对!');
		// 	return;
		// }
		uploadSelect.classList.add('loading');

		const fd = new FormData();
		fd.append('file', file);
		fd.append('filename', file.name);

		try {
			const data = await instance.post('/upload_single', fd, {
				onUploadProgress(ev) {
					const { loaded, total } = ev;
					uploadProgress.style.display = 'block';
					uploadProgressValue.style.width = `${loaded / total * 100}%`;
				}
			});
			if (+data.code === 0) {
				console.log(data.servicePath);
				uploadProgressValue.style.width = `100%`;
				await delay(500);
				alert('上传成功!');
				return;
			}
			throw data.codeText;
		}
		catch (err) {
			console.error(err)
		}
		finally {
			uploadSelect.classList.remove('loading');
			uploadProgressValue.style.width = `0%`;
			uploadProgress.style.display = 'none';
		}

	}, false);

})();

/* 多文件上传 */
(function () {
	// 容器
	const uploadContainer = document.querySelector('#upload5');
	// 选择文件的 input 框
	const uploadInput = uploadContainer.querySelector('.upload_inp');
	// `选择文件`按钮
	const uploadSelect = uploadContainer.querySelector('.upload_button.select');
	// `上传到服务器`按钮
	const uploadButton = uploadContainer.querySelector('.upload_button.upload');
	// 提示信息
	const uploadTip = uploadContainer.querySelector('.upload_tip');
	// 已选中的文件信息
	const uploadList = uploadContainer.querySelector('.upload_list');
	// 已使用的 key
	const keys = [];
	// 已选文件
	let _files = [];

	// 监听`移除文件`事件
	uploadList.addEventListener('click', function (ev) {
		const target = ev.target;
		let curLi = null;

		if (!target) {
			return;
		}

		if (target.tagName === 'EM') {
			curLi = target.parentNode.parentNode;
			if (!curLi) {
				return;
			}
			uploadList.removeChild(curLi);
			_files = _files.filter(f => f.key !== curLi.getAttribute('key'));
			if (_files.length === 0) {
				uploadList.style.display = 'none';
			}
		}
	}, false);

	// 监听`选择文件`按钮的点击事件
	uploadSelect.addEventListener('click', function (e) {
		if (uploadSelect.classList.contains('disable')) {
			return;
		}
		uploadInput.click();
	}, false);

	// 监听`得到文件`事件
	uploadInput.addEventListener('change', async function () {
		_files = Array.from(uploadInput.files);
		if (_files.length === 0) {
			return;
		}

		_files = _files.map(f => {
			return {
				file: f,
				filename: f.name,
				key: createRandom()
			}
		})
		console.log(_files);

		let str = ``;
		_files.forEach((item, index) => {
			str += `<li key="${item.key}"><span>文件${index + 1}：${item.filename}</span><span><em>移除</em></span></li>`
		});
		uploadList.innerHTML = str;
		uploadList.style.display = 'block';
	}, false);

	// 监听`上传到服务器`事件
	uploadButton.addEventListener('click', async function () {
		if (uploadButton.classList.contains('loading')) {
			return;
		}
		if (_files.length === 0) {
			alert('未选择任何文件!');
			return;
		}
		handleDisable(true);

		const lis = Array.from(uploadList.querySelectorAll('li'));
		_files = _files.map(f => {
			const fd = new FormData();
			fd.append('file', f.file);
			fd.append('filename', f.filename);
			return instance.post('/upload_single', fd, {
				onUploadProgress(ev) {
					const progress = `${(ev.load / ev.total * 100).toFixed(2)}%`;
				}
			}).then(data => {
				if (+data.code === 0) {
					return;
				}
				return Promise.reject();
			})
		});

		// 全部成功才成功，有一个失败就失败。
		Promise.all(_files);

		handleDisable(false);
	}, false);

	// 生成列表项的唯一值
	function createRandom() {
		const getRan = () => Math.random() * Date.now();
		let ran = getRan();
		while (keys.includes(ran)) {
			ran = getRan();
		}
		keys.push(ran);
		return ran.toString(16).replace('.', '');
	}
	// 按钮是否处于不可操作状态 (比如，正在上传文件...)
	function handleDisable(isDisable) {
		if (isDisable) {
			uploadButton.classList.add('loading');
			uploadSelect.classList.add('disable');
			return;
		}
		uploadSelect.classList.remove('disable');
		uploadButton.classList.remove('loading');
	}
})();

/* 大文件上传 */
(function () {
	// 容器
	const uploadContainer = document.querySelector('#upload7');
	// 选择文件的 input 框
	const uploadInput = uploadContainer.querySelector('.upload_inp');
	// `选择文件`按钮
	const uploadSelect = uploadContainer.querySelector('.upload_button.select');
	// `进度`盒子
	const uploadProgress = uploadContainer.querySelector('.upload_progress');
	// `进度条`
	const uploadProgressValue = uploadProgress.querySelector('.value');

	// 监听`选择文件`按钮的点击事件
	uploadSelect.addEventListener('click', function (e) {
		if (uploadSelect.classList.contains('disable')) {
			return;
		}
		uploadInput.click();
	}, false);

	// 监听`得到文件`事件
	uploadInput.addEventListener('change', async function () {
		const file = uploadInput.files[0];
		if (!file) {
			return;
		}

		uploadSelect.classList.add('loading');
		uploadProgress.style.display = 'block';

		// 1.询问。询问服务器已上传了哪些分片。
		const { HASH, suffix } = await fileToBuffer(file);  // 通过内容哈希请求服务器查找
		let already = [];
		try {
			const data = await instance.get('/upload_already', {
				params: {
					HASH
				}
			});
			if (+data.code === 0) {
				already = data.fileList;
			}
			else {
				throw data.codeText;
			}
		} catch (err) { }

		// 2.切片。文件切片。
		let max = 100 * 1024;
		let count = Math.ceil(file.size / max);
		let index = 0;
		const chunks = [];
		if (count > 100) {
			count = 100;
			max = file.size / count;
		}
		while (index < count) {
			chunks.push({
				file: file.slice(index * max, (index + 1) * max),
				filename: `${HASH}_${index + 1}.${suffix}`
			})
			index++;
		}

		// 3.传输。过滤出没有上传过的分片，把这些分片上传到服务器。
		chunks.forEach(c => {
			if (already.includes(c.filename)) {
				oneChunkDone();  // 已上传过，该分片上传完成，不用再上传了。
				return;
			}
			const fd = new FormData();
			fd.append('file', c.file);
			fd.append('filename', c.filename);
			instance
				.post('/upload_chunk', fd)
				.then(data => {
					if (+data.code === 0) {
						oneChunkDone();   // 分片上传成功
						return;
					}
					return Promise.reject(data.codeText);
				})
				.catch(reason => {
					console.error(reason);  // 某个分片上传失败
					clear();
				})
		})

		let finishedIndex = 0;  // 记录多少个分片已经上传成功

		function oneChunkDone() {
			// 当前切片成功
			finishedIndex++;
			// 传了百分之几，展示进度
			uploadProgressValue.style.width = `${finishedIndex / count * 100}%`;
			if (finishedIndex < count) {
				return;
			}
			uploadProgressValue.style.width = '100%';
			// 所有切片都成功时，发送合并请求
			merge();
		}

		// 4. 合并
		async function merge() {
			// 向服务器发送合并请求
			try {
				const data = await instance.post('/upload_merge', {
					HASH,   // 完整大文件的 HASH 
					count   // 总分片数量
				}, {
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'   // key1=value1&key2=value2
					}
				});
				if (+data.code === 0) {
					console.log('合并成功:', data.servicePath);
					return;
				}
				throw data.codeText;
			} catch (err) {
				alert('合并失败!');
			} finally {
				clear();
			}
		}

		function clear() {
			uploadSelect.classList.remove('loading');
			uploadProgress.style.display = 'none';
			uploadProgressValue.style.width = '0%';
		}

	}, false);

	function fileToBuffer(file) {
		return new Promise((resolve, reject) => {
			const fr = new FileReader();
			fr.onload = function (ev) {
				const buffer = ev.target.result;
				const spark = new SparkMD5.ArrayBuffer();
				spark.append(buffer);
				const hash = spark.end();
				const suffix = /\.([a-zA-Z0-9]+)$/.exec(file.name)[1];
				resolve({
					buffer: buffer,
					HASH: hash,
					suffix: suffix,
					filename: `${hash}.${suffix}`
				});
			}
			fr.onerror = function (err) {
				reject(err);
			}
			fr.readAsArrayBuffer(file);
		});
	}

})();

// 延迟函数
const delay = function delay(interval) {
	typeof interval !== "number" ? interval = 1000 : null;
	return new Promise(resolve => {
		setTimeout(() => {
			resolve();
		}, interval);
	});
};
