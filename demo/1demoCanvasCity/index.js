(function () {
    const data = {
            "name": "中国",
            "children": [{
                    "name": "浙江",
                    "children": [{
                            "name": "杭州"
                        },
                        {
                            "name": "宁波"
                        },
                        {
                            "name": "温州"
                        },
                        {
                            "name": "绍兴"
                        }
                    ]
                },
                {
                    "name": "广西",
                    "children": [{
                            "name": "桂林"
                        },
                        {
                            "name": "南宁"
                        },
                        {
                            "name": "柳州"
                        },
                        {
                            "name": "防城港"
                        }
                    ]
                },
                {
                    "name": "黑龙江",
                    "children": [{
                            "name": "哈尔滨"
                        },
                        {
                            "name": "齐齐哈尔"
                        },
                        {
                            "name": "牡丹江"
                        },
                        {
                            "name": "大庆"
                        }
                    ]
                },
                {
                    "name": "新疆",
                    "children": [{
                            "name": "乌鲁木齐"
                        },
                        {
                            "name": "克拉玛依"
                        },
                        {
                            "name": "吐鲁番"
                        },
                        {
                            "name": "哈密"
                        }
                    ]
                },
                {
                    "name": "河北",
                    "children": [{
                            "name": "石家庄"
                        },
                        {
                            "name": "唐山"
                        },
                        {
                            "name": "邯郸"
                        },
                        {
                            "name": "秦皇岛"
                        }
                    ]
                },
                {
                    "name": "西藏",
                    "children": [{
                            "name": "拉萨"
                        },
                        {
                            "name": "昌都"
                        },
                        {
                            "name": "林芝"
                        }
                    ]
                },
                {
                    "name": "江苏",
                    "children": [{
                            "name": "南京"
                        },
                        {
                            "name": "无锡"
                        },
                        {
                            "name": "徐州"
                        },
                        {
                            "name": "常州"
                        },
                        {
                            "name": "连云港"
                        },
                        {
                            "name": "淮安"
                        }
                    ]
                },
                {
                    "name": "江苏",
                    "children": [{
                            "name": "南京"
                        },
                        {
                            "name": "无锡"
                        },
                        {
                            "name": "徐州"
                        },
                        {
                            "name": "常州"
                        },
                        {
                            "name": "连云港"
                        },
                        {
                            "name": "淮安"
                        }
                    ]
                },
                {
                    "name": "湖南",
                    "children": [{
                            "name": "长沙"
                        },
                        {
                            "name": "株洲"
                        },
                        {
                            "name": "湘潭"
                        },
                        {
                            "name": "衡阳"
                        },
                        {
                            "name": "邵阳"
                        },
                        {
                            "name": "岳阳"
                        }
                    ]
                },
                {
                    "name": "海南",
                    "children": [{
                            "name": "海口"
                        },
                        {
                            "name": "三亚"
                        },
                        {
                            "name": "三沙"
                        }
                    ]
                },
                {
                    "name": "陕西",
                    "children": [{
                            "name": "西安"
                        },
                        {
                            "name": "咸阳"
                        },
                        {
                            "name": "汉中"
                        },
                        {
                            "name": "安康"
                        },
                        {
                            "name": "榆林"
                        },
                        {
                            "name": "延安"
                        }
                    ]
                },
                {
                    "name": "甘肃",
                    "children": [{
                            "name": "兰州"
                        },
                        {
                            "name": "酒泉"
                        },
                        {
                            "name": "金昌"
                        },
                        {
                            "name": "天水"
                        },
                        {
                            "name": "嘉峪关"
                        },
                        {
                            "name": "武威"
                        }
                    ]
                }
            ]
        }
	// const dataSource = 'https://s5.ssl.qhres.com/static/b0695e2dd30daa64.json'
	// const data = await (await fetch(dataSource)).json()
	const city = document.getElementById('canvas')
	const ctx = city.getContext('2d')
	const regions = d3.hierarchy(data).sum(d => 1).sort((a, b) => b.value - a.value)
	const pack = d3.pack().size([1600, 1600]).padding(3)
	const root = pack(regions)
	const TAU = Math.PI * 2

	city.addEventListener('mousemove', function (e) {
		ctx.clearRect(0, 0, city.width, city.height)
		draw(ctx, root, { clientX: e.layerX, clientY: e.layerY })
	})

	function draw(ctx, node,
		{
			fillStyle = 'rgba(0, 0, 0, 0.2)',
			textColor = 'white',
			clientX = 0,
			clientY = 0
		} = {}
	) {
		const children = node.children
		const { x, y, r } = node

		ctx.fillStyle = fillStyle
		ctx.beginPath()
		ctx.arc(x, y, r, 0, TAU)
		ctx.fill()

		if (children) {
			for (let i = 0; i < children.length; i++) {
                if (!clientX && !clientY) {
                    draw(ctx, children[i])
                } else {
                    draw(ctx, children[i], { clientX, clientY })
                }
			}
		} else {
			const name = node.data.name
            const isInner = (x / 2 - clientX) ** 2 + (y / 2 - clientY) ** 2 < r * r / 4
            if (isInner) {
                ctx.fillStyle = 'rgba(255, 0, 0, 0.2)'
                ctx.fill()
            }

			ctx.fillStyle = textColor
			ctx.font = '1.5rem Arial'
			ctx.textAlign = 'center'
			ctx.fillText(name, x, y)
		}
	}

	draw(ctx, root)
})()
