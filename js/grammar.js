const epsilon = 'ε';
const StartSign = '#'

//let test_Vn = ['E', 'T', `E'`, 'F', `T'`]
//let test_Vt = ['*', '(', ')','+','i','#']
/*let test_code = 
`
E ->T E'
E' ->+ T E'|ε
T ->F T'
T' ->* F T'|ε
F ->( E )|i
`
*/
/*
S -> T ID ( 
 */
const test_start = 'S'

const test_Vt = ['ID','INT','VOID',';','(',')','{','}','=','<'
,'<=','>','>=','==','!=','+','-','*','/','IF','WHILE','RETURN'
,'ELSE','NUM','#',',']

const test_Vn = ['S',`S'`,'T','B','C','D',`D'`,`D_`
,'E','V','F','J','I','W','H','G',`G'`,'K','L','M','N',`N'`,
'Q','Y','R','U']
const test_code =
` S ->T ID ( D' S'
S' ->) B #
T -> INT | VOID
B -> { C E }
C -> INT ID ; C |ε
D -> INT ID
D' -> D D_|ε
D_ -> , D D_ |ε
E -> F V
V -> F V|ε
F -> G|H|I|J
J -> ID = K ;
I -> RETURN W
W->K ;|;
H->WHILE ( K ) B
G->IF ( K ) B G'
G'->ELSE B|ε
K ->L Q
L -> M R
M -> N U 
N -> N'|ε
N' ->ID|NUM|( K )
Q -> Y L Q |ε
Y -> <|<=|>|>=|==|!=
R -> + M R|- M R|ε
U -> * N' U|/ N' U|ε
`

const test_res =[
    [ 'INT', '-' ],   [ 'ID', '1' ],     [ '(', '-' ],   [ ')', '-' ],
    [ '{', '-' ],     [ 'INT', '-' ],    [ 'ID', '2' ],  [ ';', '-' ],
    [ 'INT', '-' ],   [ 'ID', '3' ],     [ ';', '-' ],   [ 'INT', '-' ],
    [ 'ID', '4' ],    [ ';', '-' ],      [ 'INT', '-' ], [ 'ID', '5' ],
    [ ';', '-' ],     [ 'INT', '-' ],    [ 'ID', '6' ],  [ ';', '-' ],
    [ 'INT', '-' ],   [ 'ID', '7' ],     [ ';', '-' ],   [ 'ID', '8' ],
    [ '=', '-' ],     [ 'NUM', '1' ],    [ '*', '-' ],   [ 'NUM', '2' ],
    [ '*', '-' ],     [ 'NUM', '4' ],    [ '*', '-' ],   [ 'ID', '9' ],
    [ '+', '-' ],     [ 'ID', '10' ],    [ '/', '-' ],   [ 'NUM', '2' ],
    [ '*', '-' ],     [ 'NUM', '2' ],    [ ';', '-' ],   [ 'ID', '11' ],
    [ '=', '-' ],     [ '-', '-' ],      [ 'NUM', '1' ], [ ';', '-' ],
    [ 'IF', '-' ],    [ '(', '-' ],      [ 'ID', '12' ], [ '>', '-' ],
    [ '(', '-' ],     [ 'ID', '13' ],    [ '+', '-' ],   [ 'ID', '14' ],
    [ ')', '-' ],     [ ')', '-' ],      [ '{', '-' ],   [ 'ID', '15' ],
    [ '=', '-' ],     [ 'ID', '16' ],    [ '+', '-' ],   [ '(', '-' ],
    [ 'ID', '17' ],   [ '*', '-' ],      [ 'ID', '18' ], [ '+', '-' ],
    [ 'NUM', '1' ],   [ ')', '-' ],      [ ';', '-' ],   [ '}', '-' ],
    [ 'ELSE', '-' ],  [ '{', '-' ],      [ 'ID', '19' ], [ '=', '-' ],
    [ 'ID', '20' ],   [ ';', '-' ],      [ '}', '-' ],   [ 'WHILE', '-' ],
    [ '(', '-' ],     [ 'ID', '21' ],    [ '<=', '-' ],  [ '(', '-' ],
    [ 'NUM', '100' ], [ '+', '-' ],      [ 'NUM', '3' ], [ ')', '-' ],
    [ ')', '-' ],     [ '{', '-' ],      [ 'ID', '22' ], [ '=', '-' ],
    [ 'ID', '23' ],   [ '*', '-' ],      [ 'NUM', '2' ], [ ';', '-' ],
    [ '}', '-' ],     [ 'RETURN', '-' ], [ 'NUM', '0' ], [ ';', '-' ],
    [ '}', '-' ],     [ '#', '-' ]
  ]
const test_gm = `S S' T B C D D' D_ E V F J I W H G G' K L M N N' Q Y R U
ID INT VOID ; , ( ) { } = < <= > >= == != + - * / IF WHILE RETURN ELSE  NUM #
S ->T ID ( D' S'
S' ->) B #
T -> INT | VOID
B -> { C E }
C -> INT ID ; C |ε
D -> INT ID
D' -> D D_|ε
D_ -> , D D_ |ε
E -> F V
V -> F V|ε
F -> G|H|I|J
J -> ID = K ;
I -> RETURN W
W->K ;|;
H->WHILE ( K ) B
G->IF ( K ) B G'
G'->ELSE B|ε
K ->L Q
L -> M R
M -> N U
N -> N'|ε
N' ->ID|NUM|( K )
Q -> Y L Q |ε
Y -> <|<=|>|>=|==|!=
R -> + M R|- M R|ε
U -> * N' U|/ N' U|ε`

class Node 
{
    constructor(val,parent,kids)
    {
        this.val = val
        this.parent = parent
        this.kids = kids
    }
}
// 实现栈的简单方法
class Stack
{
    constructor()
    {
        this.data = []
        this.size = 0
    }
    push(item)
    {
        this.data.push(item)
        this.size++
    }
    pop()
    {
        this.size--
        return this.data.pop()
    }
    top()
    {
        return this.data[this.size-1]
    }
}
// 实现集合并运算
function union(setA, setB) {
    let _union = new Set(setA);
    for (let elem of setB) {
        _union.add(elem);
    }
    return _union;
}

// 实现集合等于号计算
function isSameSet(set, subset) {
    let status = true;
    // 集合a是否有集合b的所有元素
    for (let elem of subset) {
        if (!set.has(elem)) {
            status = false;
        }
    }
    // 集合a是否等于集合b的大小
    return status&(set.size==subset.size);
}
// 实现一个集合的浅拷贝
function mySetCopy(set)
{
    let new_set = new Set(set)
    return new_set
}
// 实现将一个string和一个arr拼成一个string
function concatStrArr(str,arr)
{
    let res =str+'->'
    for(let i in arr)
    {
        res+=arr[i]
    }
    return res
}
// 文法输入规则 每个非终结符和终结符 相互之间都需要一个空格
class grammar
{
    // 构造函数
    constructor(start,Vn,Vt,code)
    {
        this.start = start // 初始符号
        this.Vn = null // 非终结符集合
        this.Vt = null // 终结符集合
        this.data = null//输入的文法字符串
        this.first = null// first集合
        this.follow = null // follow集合
        this.table = null // 预测分析表
        this.wrongPos = null; // 记录错误的位置
        this.load_grammar(Vn,Vt,code)
        this.res = []
        this.output = null
    }
    // 重新输入文法 data为txt
    load_grammar(Vn,Vt,data)
    {
        this.Vn = Vn // 非终结符集合
        this.Vt = Vt // 终结符集合
        this.data = this.preprocess_data(data)//输入的文法字符串
        this.first = null
        this.get_first()// 读取first集合
        this.follow = null // 读取follow集合
        
        let a = new Set(['IF', 'WHILE', 'RETURN', 'ID','ε'])
        let b = new Set(['IF', 'WHILE', 'RETURN', 'ID','ε'])
        let c = new Set(['<', '<=', '>', '>=', '==', '!=','ε'])
        this.first.set('statement',a)
        this.first.set('statementChainCommon',b)
        this.first.set('expressionCommon',c)
        this.get_follow()
        this.table = null
        this.get_table()/*
        console.log(this.table.get('statementChain'))
        console.log('the grammar is',this.data)
        console.log('the first set is',this.first)
        console.log('the follow set is',this.follow)
        console.log('the table is',this.table)*/
        
        this.res = []
    }
    // 外部设置接口
    set_Vn(Vn)
    {
        this.Vn = Vn
    }
    set_Vt(Vt)
    {
        if(Vt.indexOf('#')=-1)
        {
            Vt.push('#') //如果终结符中不存在@ 那么加入@
        }
        this.Vt = Vt
    }
    set_start(start)
    {
        this.start = start
    }
    getRes()
    {
        return this.res
    }
    // 对文法的数据预处理
    preprocess_data(gm)
    {
        //gm:输入的文法字符串
        //return:返回一个map结构,key为非终结符,value为其对应所有产生式的数组
        let res = new Map([])
        gm = String(gm).split('\n')

        for(let each in gm)
        {
            let line = gm[each] // 读取文法的某一行
            if(line =='')
            {
                continue; //避免出现最后一行两个换行符的情况
            }
            let tmp = line.split('->') // 读取产生式左部
            let arr = tmp[1].split('|')
            let sub_res = [] //定义文法单行array
            for(let i in arr)
            {
                let sub_arr = arr[i].split(' ')
                let subsub_res = [] // 定义单个产生式array
                for(let j in sub_arr)
                {
                    if(sub_arr[j]!='') //删除所有空元素
                    {
                        subsub_res.push(sub_arr[j])
                    }
                }
                sub_res.push(subsub_res)
            }
            let str = tmp[0]
            str = str = str.replace(/\s*/g,"");
            res.set(str,sub_res)
        }
        return res
    }
    // 获取单个符号的first
    get_single_first(sign)
    {
        let firstX = new Set([])
        if(this.Vt.indexOf(sign)!=-1)
        {   //终结符集合中存在sign
            firstX.add(sign)
            this.first.set(sign,firstX) //sign为终结符，那么first(x) = {x}
        }
        // sign为非终结符 
        let arr = this.data.get(sign) //二位数组
        for(let i in arr)
        {
            let sub_arr = arr[i] // 按每一句产生式进行分析
            if(this.Vt.indexOf(sub_arr[0])!=-1)
            {
                firstX.add(sub_arr[0]) // 如果有 X->a... a为非终结符 那么将a加入FirstX
            }
            else if(sub_arr[0]==epsilon) // 如果有epsilon 加FirstX
            {
                firstX.add(epsilon)
            }
            else // X->ABCd....情况
            {
                let cur=0,len = sub_arr.length
                for(cur=0;cur<len;cur++)
                {
                    if(!this.first.has(sub_arr[cur])) //如果对应还没有计算，那么先计算该符号对应的first
                    {
                        this.get_single_first(sub_arr[cur])
                    }
                    let first_cur = this.first.get(sub_arr[cur])//取出当前符号的first
                    firstX = union(firstX,first_cur)
                    if(!first_cur.has(epsilon))//取到一个不含epsilon的,进行break操作
                    {
                        firstX.delete(epsilon)
                        break
                    }
                    if(cur==len-1)
                    {
                        firstX.add(epsilon) // 如果遍历了所有也不含有epsilon，那么把epsilon加入
                    }
                }

            }
        }
        this.first.set(sign,firstX)
    }
    //获得某一个array的first集合
    get_str_first(arr) 
    {
        let firstX = new Set([])
        let cur=0,len=arr.length
        for(cur=0;cur<len;cur++)
        {
            let first_cur = this.first.get(arr[cur])
            firstX  = union(firstX,first_cur)
            firstX.delete(epsilon)//先加入再删除
            if(!first_cur.has(epsilon))//取到一个不含epsilon的,进行break操作
            {
                firstX.delete(epsilon)
                break
            }
            if(cur==len-1)
            {
                firstX.add(epsilon) // 如果遍历了所有也不含有epsilon，那么把epsilon加入
            }
        }
        return firstX
    }
    // 获得first集合
    get_first()
    {
        this.first = new Map([]) // 新对象
        this.first.set(epsilon,new Set([epsilon]))
        for(let i in this.Vt)
        {
            this.get_single_first(this.Vt[i]) // 计算终结符的first
        }
        for(let i in this.Vn)
        {
            if(!this.first.has(this.Vn[i])) // 如果这个非终结符的first还没有计算过
            {
                this.get_single_first(this.Vn[i])//那么计算这个非终结符的first
            }
        }
    }
    // 获得follow集合
    get_follow()
    {
        this.follow = new Map([])
        for(let i in this.Vn)
        {
            let followX = new Set([])
            this.follow.set(this.Vn[i],followX)
        }
        this.follow.get(this.start).add(StartSign)
        let cal_again = true //是否要计算的标志位
        while(cal_again)
        {
            cal_again = false //每次计算所有非终结符的follow设置一次标志位
            for(let i in this.Vn)
            {
                let X = this.Vn[i]
                // 遍历所有的产生式
                for(let gen of this.data)
                {
                    let S = gen[0] //此时的非终结符
                    let arr = gen[1]
                    for(let j in arr)
                    {
                        let sub_arr = arr[j] // 提取到产生式
                        if(sub_arr.indexOf(X)!=-1) // 该产生式存在X
                        {
                            let pos = sub_arr.indexOf(X) // X的位置
                            let len = sub_arr.length // array的长度
                            if(pos==len-1) // S->aX Follow(S)加入Follow(X)
                            {
                                let old_set = mySetCopy(this.follow.get(X)) //旧集合
                                let new_set = union(this.follow.get(X),this.follow.get(S))//新集合
                                this.follow.set(X,new_set) //
                                cal_again = !(isSameSet(old_set,new_set)) // 旧集合!=新集合 于是要继续计算
                            }
                            else // S->aXB
                            {
                                let rest_arr = sub_arr.slice(pos+1,len) //求B
                                let firstB = this.get_str_first(rest_arr)
                                let old_set = mySetCopy(this.follow.get(X)) //旧集合
                                let new_set = union(this.follow.get(X),firstB)//新集合=followX + first B-epsilon
                                new_set.delete(epsilon) //-epsilon
                                this.follow.set(X,new_set) //
                                cal_again = !(isSameSet(old_set,new_set)) // 旧集合!=新集合 于是要继续计算
                                if(firstB.has(epsilon)) // firstB中有epsilon follow S 加入
                                {
                                    let old_set = mySetCopy(this.follow.get(X)) //旧集合
                                    let new_set = union(this.follow.get(X),this.follow.get(S))//新集合
                                    this.follow.set(X,new_set) //
                                    cal_again = !(isSameSet(old_set,new_set)) // 旧集合!=新集合 于是要继续计算
                                }

                            }
                        }
                    }
                }
            }
        }
    }
    // 生成预测分析表
    get_table()
    {
        this.table = new Map([])//生成空map
        for(let i in this.Vn)
        {
            for(let j in this.Vt)
            {
                this.table.set(this.Vn[i]+this.Vt[j],'error')
            }
        }
        // 遍历所有产生式
        for(let gen of this.data)
        {
            let S = gen[0] //此时的非终结符
            let arr = gen[1]
            for(let j in arr)
            {
                let sub_arr = arr[j] // 提取到产生式 每一个产生式
                let firstX = this.get_str_first(sub_arr) 
                for(let item of firstX) // 对于产生式 S->X
                {
                    if(item!=epsilon)
                    {
                        this.table.set(S+item,[concatStrArr(S,sub_arr),sub_arr])
                    }
                }
                if(firstX.has(epsilon)) // epsilon在firstX中
                {
                    let followS = this.follow.get(S)
                    for(let item of followS) // 对于产生式 S->X
                    {
                        this.table.set(S+item,[concatStrArr(S,sub_arr),sub_arr])
                    }
                }
                
            }
        }
    }
    // 根据预测分析表来读取一个string(不过需要按照规则转化为对应的单词串array)
    read_str(arr)
    {
        let save_stack = new Stack() 
        this.res = [] // empty the res arr
        save_stack.push('#') // 设置保留栈
        save_stack.push(this.start) //
        let len = arr.length
        let count = 0       
        let temp = []
        let a = []
        for(let cur=0;cur<len;cur++)
        {
            count++ //计数器++
            let ch = arr[cur][0] // 当前读到的字符  1为对应的值
            let val = arr[cur][1]
            let top = save_stack.top()
            //console.log(save_stack.data)
            //console.log(arr[cur])
            temp.push(top)
            if(ch==top) //等于栈顶
            {
                temp.push(val)
                if(top=='#') // top = ch =#
                {
                    console.log(`${count}:分析成功！！！`)
                    this.res.push(`${count}:分析栈:${save_stack.data}  ,分析成功！！！\n`)
                    this.output = temp
                    return true
                }
                else //cur++
                {
                    //console.log(`${count}:${top},退栈，输入前进`)
                    //this.res.push(`${count}:分析栈:${save_stack.data}  ,${top}退栈，输入前进\n`)
                    save_stack.pop() //栈弹出
                }
            }
            else if(this.Vt.indexOf(top)!=-1)//栈顶为终结符
            {
                console.log(`${count}:分析失败`)
                this.wrongPos = cur
                this.res.push(`${count}:分析栈:${save_stack.data}  ,分析失败\n`)
                return false;
            }
            else
            {
                let res = this.table.get(top+ch)//尝试读取
                //console.log(res,top,ch)
                if(res=='error')
                {
                    //console.log(`${count}:分析失败`)
                    this.wrongPos = cur
                    this.res.push(`${count}:分析栈:${save_stack.data}  ,分析失败\n`)
                    //console.log(a)
                    return false
                }
                else
                {
                    cur--//指针不变
                    let old_top = save_stack.pop() //栈顶弹出
                    //console.log(`${count}:使用产生式,${res[0]}`)
                    a.push(res[0])
                    this.res.push(`${count}:分析栈:${save_stack.data}  ,使用产生式,${res[0]}\n`)
                    let sub_arr = res[1]
                    if(sub_arr.length==1&&sub_arr[0]==epsilon)//空串产生式
                    {
                       // console.log(`${count}:${old_top},退栈`)
                        this.res.push(`${count}:分析栈:${save_stack.data}  ,${old_top}退栈\n`)
                        continue
                    }
                    for(let i=sub_arr.length-1;i>=0;i--)
                    {
                        save_stack.push(sub_arr[i]) //产生式逆序入栈
                    }
                }
            }
        }
    }

}
let my_grammar = new grammar(test_start,test_Vn,test_Vt,test_code)
my_grammar.read_str(test_res)
const test_id_list =[
    'main', 'i', 'j', 'k',
    'a',    'b', 'c', 'j',
    'i',    'i', 'k', 'a',
    'b',    'c', 'j', 'a',
    'b',    'c', 'j', 'a',
    'i',    'i', 'j'
  ]

class gernerator
{
    constructor(data,idList)
    {
        this.data = data
        this.cur = 0
        this.idList = idList
        this.t=0
        this.quadList = []
        this.define = new Map([])
        this.errorINFO = ''
        this.errorFlag = false
        console.log(this.data)
    }
    callT()
    {
        this.t++
        return this.t
    }
    freeT()
    {
        return 
    }
    getPresentAddr()
    { // 获得指向四元式列表表尾的指针
        return this.quadList.length-1
    }
    process_sign()
    {
        let sign = this.data[this.cur]
        this.cur+=2
        return sign
    }
    process_INT()
    {
        this.cur+=2
    }
    process_NUM()
    {
        let val = this.data[this.cur+1]
        console.log(val)
        this.cur+=2
        return val
    }
    process_VOID()
    {
        this.cur+=2
    }
    process_ID()
    {
        let id = this.idList[this.data[this.cur+1]-1]
        console.log(id)
        this.cur+=2
        return id
    }
    process_RETURN()
    {
        this.cur+=2
    }
    process_WHILE()
    {
        this.cur+=2
    }
    process_IF()
    {
        this.cur+=2
    }
    process_ELSE()
    {
        this.cur+=2
    }
    process_S()// S ->T ID ( D' S'
    {
        console.log('process S',this.cur,this.data[this.cur])
        this.cur++ // 指针移动
        this.process_T()
        this.process_ID()
        this.process_sign()
        this.process_DPLUS()
        this.process_SPLUS()
    }
    process_SPLUS()// S' ->) B #
    {
        console.log('process SPLUS',this.cur,this.data[this.cur])
        this.cur++ // 指针移动
        this.process_sign()
        this.process_B()
        return true
    }
    process_T() // T -> INT | VOID
    {
        console.log('process T',this.cur,this.data[this.cur])
        this.cur++ // 指针移动
        if(this.data[this.cur]=='INT',this.cur,this.data[this.cur])
        {
            this.process_INT()
        }
        else
        {
            this.process_VOID()
        }
    }
    process_B() // B -> { C E }
    {
        console.log('process B',this.cur,this.data[this.cur])
        this.cur++ // 指针移动
        this.process_sign()
        this.process_C()
        this.process_E()
        this.process_sign()
    }
    process_C() // C -> INT ID ; C |ε
    {
        console.log('process C',this.cur,this.data[this.cur])
        this.cur++ // 指针移动
        if(this.data[this.cur]=='INT')
        {
            this.process_INT()
            let id = this.process_ID()
            this.define.set(id,'INT')
            this.process_sign()
            this.process_C()
        }

    }
    process_D() // D -> INT ID
    {
        console.log('process D',this.cur,this.data[this.cur])
        this.cur++ // 指针移动
        this.process_INT()
        this.process_ID()
    }
    process_DPLUS() // D' -> D D_|ε
    {
        console.log('process DPLUS',this.cur,this.data[this.cur])
        this.cur++ // 指针移动
        if(this.data[this.cur]=='D')
        {
            this.process_D()
            this.process_DPLUSPLUS()
        }
    }
    process_DPLUSPLUS() // D_ -> , D D_ |ε
    {
        console.log('process DPLUSPLUS',this.cur,this.data[this.cur])
        this.cur++ // 指针移动
        if(this.data[this.cur]=='D')
        {
            this.process_sign()
            this.process_D()
            this.process_DPLUSPLUS()
        }
    }
    process_E() // E -> F V
    {
        console.log('process E',this.cur,this.data[this.cur])
        this.cur++ // 指针移动
        this.process_F()
        this.process_V()
    }
    process_V() // V -> F V|ε
    {
        console.log('process V',this.cur,this.data[this.cur])
        this.cur++ // 指针移动
        if(this.data[this.cur]=='F')
        {
            this.process_F()
            this.process_V()
        }
    }
    process_F() // F -> G|H|I|J
    {
        console.log('process F',this.cur,this.data[this.cur])
        this.cur++ // 指针移动
        if(this.data[this.cur]=='G')
        {
            this.process_G()
        }
        else if(this.data[this.cur]=='H')
        {
            this.process_H()
        }
        else if(this.data[this.cur]=='I')
        {
            this.process_I()
        }
        else if(this.data[this.cur]=='J')
        {
            this.process_J()
        }
    }
    process_J() // J -> ID = K ;
    {
        console.log('process J',this.cur,this.data[this.cur])
        this.cur++ // 指针移动
        this.freeT()
        let id = this.process_ID()
        if(!this.define.has(id))
        {
            console.log(id,'没有被定义就被使用')
            this.errorINFO += id+',没有被定义就被使用\n'
            this.errorFlag = true
        }
        this.process_sign()
        let Kres = this.process_K()
        this.process_sign()
        this.freeT()
        console.log(id,'=',Kres,'')
        this.quadList.push([':=',Kres,'_',id])

    }
    process_I() // I -> RETURN W
    {
        console.log('process I',this.cur,this.data[this.cur])
        this.cur++ // 指针移动
        this.process_RETURN()
        let Wres = this.process_W()
        this.quadList.push(['RETURN',Wres,'_','_'])
    }
    process_W() // W->K ;|;
    {
        console.log('process W',this.cur,this.data[this.cur])
        this.cur++ // 指针移动
        if(this.data[this.cur]=='K',this.cur,this.data[this.cur])
        {
            let Kres = this.process_K()
            this.process_sign()
            return Kres
        }
        else
        {
            this.process_sign()
        }
    }
    process_H() // H->WHILE ( K ) B
    {
        console.log('process H',this.cur,this.data[this.cur])
        this.cur++ // 指针移动
        this.process_WHILE()
        this.process_sign()
        let jmpAddr = this.getPresentAddr()+1 // 指向while条件跳转的四元式
        let Kres = this.process_K()
        // 条件符合，那么跳转到无条件跳转的下一条四元式
        this.quadList.push(['J'+Kres[1],Kres[0],Kres[2],this.getPresentAddr()+3])
        this.quadList.push(['J','_','_',0]) // 条件不符合，无条件跳转到while循环的下一条
        let whileAddr = this.getPresentAddr() // 指向while无条件跳转的四元式，用于回填
        
        this.process_sign()
        this.process_B()
        this.quadList.push(['J','_','_',jmpAddr])
        let endAddr = this.getPresentAddr()+1 //指向while后的下一条四元式
        this.quadList[whileAddr] = ['J','_','_',endAddr]
        console.log('while',Kres,jmpAddr,endAddr)

    }
    process_G() // G->IF ( K ) B G'
    {
        console.log('process G',this.cur,this.data[this.cur])
        this.cur++ // 指针移动
        this.process_IF()
        this.process_sign()
        let Kres = this.process_K()
        // if jump
        this.quadList.push(['J'+Kres[1],Kres[0],Kres[2],this.getPresentAddr()+3])
        // unconditional jump
        this.quadList.push(['J','_','_',0])
        let unconJmpAddr = this.getPresentAddr()

        this.process_sign()
        
        let ifAddr = this.getPresentAddr() 
        
        this.process_B()
        // unconditional jump to end
        this.quadList.push(['J','_','_',0])
        let ifUnconJmp = this.getPresentAddr()
        let elseAddr = ifUnconJmp+1
        let GPLUSres = this.process_GPLUS()
        let endAddr = this.getPresentAddr()+1 // 跳到整个if的下一条指令
        this.quadList[ifUnconJmp] = ['J','_','_',endAddr]
        if(GPLUSres == epsilon)
        {
            this.quadList[unconJmpAddr] = ['J','_','_',endAddr]
        }
        else
        {
            this.quadList[unconJmpAddr] = ['J','_','_',elseAddr]

        }
        
    }
    process_GPLUS() // G'->ELSE B|ε
    {
        console.log('process GPLUS',this.cur,this.data[this.cur])
        this.cur++ // 指针移动
        if(this.data[this.cur]=='ELSE')
        {
            this.process_ELSE()
            this.process_B()
            return this.getPresentAddr()
        }
        else
        {
            return epsilon
        }
    }
    process_K() // K ->L Q
    {
        console.log('process K',this.cur,this.data[this.cur])
        this.cur++ // 指针移动
        let Lres = this.process_L()
        let Qres = this.process_Q()
        console.log(Lres,Qres)
        if(Qres==epsilon)
        {
            return Lres
        }
        else if(Lres == epsilon)
        {
            return Qres
        }
        else
        {
            console.log(Lres,Qres[0],Qres[1])
            return [Lres,Qres[0],Qres[1]]
        }

    }
    process_L() // L -> M R
    {
        console.log('process L',this.cur,this.data[this.cur])
        this.cur++ // 指针移动
        let Mres = this.process_M()
        let Rres = this.process_R()
        if(Rres==epsilon)
        {
            return Mres
        }
        else if(Mres == epsilon)
        {
            // 算一次
            let tmp = 't'+this.callT()
            if(Rres[0]=='-')
            {
                this.quadList.push(['@',Rres[1],'_',tmp])
            }
            console.log(Rres[0],Rres[1],'_',tmp)
            return tmp
        }
        else
        {
            // 算一次
            let tmp = 't'+this.callT()
            this.quadList.push([Rres[0],Mres,Rres[1],tmp])
            console.log(Mres,Rres[0],Rres[1],tmp)
            return tmp
            //计算一次
        }
    }
    process_M() // M -> N U
    {
        console.log('process M',this.cur,this.data[this.cur])
        this.cur++ // 指针移动
        let Nres = this.process_N()
        let Ures = this.process_U()
        if(Ures == epsilon)
        {
            return Nres
        }
        else
        {
            let tmp = 't'+this.callT()
            this.quadList.push([Ures[0],Nres,Ures[1],tmp])
            console.log(Nres,Ures[0],Ures[1],tmp)
            return tmp
            //计算一次
        }
    }
    process_N() // N -> N'|ε
    {
        console.log('process N',this.cur,this.data[this.cur])
        this.cur++
        if(this.data[this.cur]==`N'`)
        {
            return this.process_NPLUS()
        }
        else
        {
            return epsilon
        }

    }
    process_NPLUS() // N' ->ID|NUM|( K )
    {
        console.log('process NPLUS',this.cur,this.data[this.cur])
        this.cur++ // 指针移动
        let res = null
        if(this.data[this.cur]=='ID')
        {
            res = this.process_ID()
            if(!this.define.has(res))
            {
                console.log(res,'没有被定义就被使用')
                this.errorINFO += res+',没有被定义就被使用\n'
                this.errorFlag = true
            }
        }
        else if(this.data[this.cur]=='NUM')
        {
            res = this.process_NUM()
        }
        else if(this.data[this.cur]=='(')
        {
            this.process_sign()
            res = this.process_K()
            this.process_sign()
        }
        return res
    }
    process_Q() // Q -> Y L Q |ε
    {
        console.log('process Q',this.cur,this.data[this.cur])
        this.cur++ // 指针移动
        if(this.data[this.cur]=='Y')
        {
            let Yres = this.process_Y()
            let Lres = this.process_L()
            let Qres = this.process_Q()
            console.log(Yres,Lres,Qres)
            if(Qres==epsilon)
            {
                return [Yres,Lres]
            }
        }
        else
        {
            return epsilon
        }
    }
    process_Y() // Y -> <|<=|>|>=|==|!=
    {
        console.log('process Y',this.cur,this.data[this.cur])
        this.cur++ // 指针移动
        let sign = this.process_sign()
        return sign
    }
    process_R() //R -> + M R|- M R|ε
    {
        console.log('process R',this.cur,this.data[this.cur])
        this.cur++ // 指针移动
        if(this.data[this.cur]=='+'||this.data[this.cur]=='-')
        {
            let sign = this.data[this.cur]
            this.process_sign()
            let Mres = this.process_M()
            let Rres = this.process_R()
            if(Rres==epsilon)
            {
                return [sign,Mres]
            }
            else
            {
                let tmp = 't'+this.callT()
                this.quadList.push([Rres[0],Mres,Rres[1],tmp])
                console.log(Mres,Rres[0],Rres[1],tmp)
                return [sign,tmp]
                //计算
            }
        }
        else
        {
            return epsilon
        }
    }
    process_U() //U -> * N U|/ N U|ε
    {
        console.log('process U',this.cur,this.data[this.cur])
        this.cur++ // 指针移动
        if(this.data[this.cur]=='*'||this.data[this.cur]=='/')
        {
            let sign = this.data[this.cur]
            this.process_sign()
            let Nres = this.process_NPLUS()
            let Ures = this.process_U()
            if(Ures==epsilon)
            {
                return [sign,Nres]
            }
            else
            {
                // 对上一级结果做处理
                let tmp = 't'+this.callT()
                this.quadList.push([Ures[0],Nres,Ures[1],tmp])
                console.log(Nres,Ures[0],Ures[1],tmp)
                return [sign,tmp]
            }
        }
        else
        {
            return epsilon
        }
    }
    process(output,id_list)
    {
        this.data = output
        this.idList = id_list
        this.cur = 0
        this.quadList = []
        this.define = new Map([])
        this.errorFlag = false;
        this.errorINFO = ''
        if(this.data[0]=='S')
        {
            this.process_S()
        }
        console.log(this.data[this.cur])
        console.log(this.quadList)
        this.quadList.push(['END'])
        this.output_quad()
    }
    output_quad()
    {
        let res = ''
        
        for(let i in this.quadList)
        {
            console.log(i,this.quadList[i])
            res+=(i.toString()+': ('+this.quadList[i]+')');
            res+='\n'
        }
        console.log(res)
        return res
    }
}
console.log(my_grammar.res)
let my_gen = new gernerator(my_grammar.output,test_id_list)
my_gen.process(my_grammar.output,test_id_list)

