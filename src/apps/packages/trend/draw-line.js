

const DrawLine = {
  AttributeGroup: [],
  LineGroup: [],
  table: false,
  check(a) {
    return /^(charball|cbg)/i.test(a.className)
  },
  bind(b) {
    this.table = b
    return this
  },
  color(a) {
    LG.color = a
    return this
  },
  draw(e) {
    if (!this.table) {
      return
    }
    if (e) {
      const d = this.AttributeGroup.length
      for (let a = 0; a < d; a++) {
        const b = this.AttributeGroup[a]
        LG.color = b.color
        JoinLine.indent = b.indent
        this.LineGroup.push(new LG(this.table, b[0], b[1], b[2], b[3], this.check))
      }
    }
    return this
  },
  show(c) {
    const b = this.LineGroup.length
    for (let a = 0; a < b; a++) {
      this.LineGroup[a].show(c)
    }
  },
  add(a, d, b, c) {
    this.AttributeGroup.push([a, d, b, c])
    this.AttributeGroup[this.AttributeGroup.length - 1].color = LG.color
    this.AttributeGroup[this.AttributeGroup.length - 1].indent = JoinLine.indent
    return this
  },
}
var JoinLine = function(a, b) {
  this.color = a || '#000000'
  this.size = b || 1
  this.lines = []
  this.tmpDom = null
  this.visible = true
  this.box = document.body
}

JoinLine.prototype = {
  show(b) {
    for (let a = 0; a < this.lines.length; a++) {
      this.lines[a].style.visibility = b ? 'visible' : 'hidden'
    }
  },
  remove() {
    for (let a = 0; a < this.lines.length; a++) {
      this.lines[a].parentNode.removeChild(this.lines[a])
    }
    this.lines = []
  },
  join(g, f) {
    this.remove()
    this.visible = f ? 'visible' : 'hidden'
    this.tmpDom = document.createDocumentFragment()
    for (let e = 0; e < g.length - 1; e++) {
      const d = this.pos(g[e])
      const c = this.pos(g[e + 1])
      if (document.all) {
        this.IELine(d.x, d.y, c.x, c.y)
      } else {
        this.FFLine(d.x, d.y, c.x, c.y)
      }
    }
    document.body.appendChild(this.tmpDom)
  },
  pos(c) {
    if (c.nodeType == undefined) {
      return c
    }
    let d = {
        x: 0,
        y: 0,
      },
      b = c
    for (; b; b = b.offsetParent) {
      d.x += b.offsetLeft
      d.y += b.offsetTop
      if (this.wrap && b.offsetParent === this.wrap) {
        break
      }
    }
    d.x += parseInt(c.offsetWidth / 2)
    d.y += parseInt(c.offsetHeight / 2)
    return d
  },
  FFLine(c, g, b, f) {
    if (Math.abs(g - f) < (JoinLine.indent * 2) && c == b) {
      return
    }
    const h = this.nPos(c, g, b, f, JoinLine.indent)
    c = h[0]
    g = h[1]
    b = h[2]
    f = h[3]
    const d = document.createElement('canvas')
    d.style.position = 'absolute'
    d.style.visibility = this.visible
    d.width = Math.abs(c - b) || this.size
    d.height = Math.abs(g - f) || this.size
    const i = Math.min(g, f)
    const a = Math.min(c, b)
    d.style.top = `${i}px`
    d.style.left = `${a}px`
    const e = d.getContext('2d')
    e.save()
    e.strokeStyle = this.color
    e.lineWidth = this.size
    e.globalAlpha = 1
    e.beginPath()
    e.moveTo(c - a, g - i)
    e.lineTo(b - a, f - i)
    e.closePath()
    e.stroke()
    e.restore()
    this.lines.push(d)
    this.tmpDom.appendChild(d)
  },
  IELine(c, e, b, d) {
    if (Math.abs(e - d) < (JoinLine.indent * 2) && c == b) {
      return
    }
    const f = this.nPos(c, e, b, d, JoinLine.indent)
    c = f[0]
    e = f[1]
    b = f[2]
    d = f[3]
    const a = document.createElement('<esun:line></esun:line>')
    a.from = `${c},${e}`
    a.to = `${b},${d}`
    a.strokeColor = this.color
    a.strokeWeight = `${this.size}px`
    a.style.cssText = 'position:absolute;z-index:999;top:0;left:0'
    a.style.visibility = this.visible
    a.coordOrigin = '0,0'
    this.lines.push(a)
    this.tmpDom.appendChild(a)
  },
  nPos(g, o, f, m, e) {
    let p = g - f,
      n = o - m
    const k = Math.round(Math.sqrt(Math.pow(p, 2) + Math.pow(n, 2)))
    let d,
      j,
      q,
      h
    const l = Math.round((p * e) / k)
    const i = Math.round((n * e) / k)
    return [f + l, m + i, g - l, o - i]
  },
}
JoinLine.indent = 8
var LG = function(r, o, m, b, p, h) {
  const n = {
    x: o || 0,
    y: m || 0,
    w: b || 0,
    oh: p || 0,
  }
  const g = document.getElementById(r).rows
  const c = n.y < 0 ? (g.length + n.y) : n.y
  const a = g.length - n.oh
  const l = n.x < 0 ? (g[c].cells.length + n.x) : n.x
  let q = l + n.w
  if (q > g[c].cells.length) {
    q = g[c].cells.length
  }
  if (n.w == 0) {
    q = g[c].cells.length
  }
  this.g = []
  for (let f = c; f < a; f++) {
    const k = g[f].cells
    for (let e = l; e < q; e++) {
      const d = k[e]
      if (d) {
        if (h(d, e, f) === true) {
          this.g.push(d)
        }
      }
    }
  }
  if (LG.autoDraw) {
    this.draw()
  }
}

LG.color = '#E4A8A8'
LG.size = 2
LG.autoDraw = true
LG.isShow = true
LG.prototype = {
  draw() {
    this.line = new JoinLine(LG.color, LG.size)
    this.line.join(this.g, LG.isShow)
  },
  show(a) {
    this.line.show(a)
  },
}
const Chart = {}
Chart.on = function(c, b, a) {
  c.attachEvent ? c.attachEvent(`on${b}`, () => {
    a.call(c)
  }) : c.addEventListener(b, a, false)
}

Chart.ini = {
  default_has_line: true,
}
Chart.init = function() {
  if (!Chart.ini.default_has_line) {
    return
  }
  const a = document.getElementById('has_line')
  if (!a) {
    return
  }
  a.checked = 'checked'
  DrawLine.AttributeGroup = []
  DrawLine.LineGroup = []
}

const fw = {}
fw.onReady = function(a) {
  Chart.on(window, 'load', a)
}


export default {
  Chart,
  DrawLine,
}
