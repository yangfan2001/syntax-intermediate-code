
// 定义基于语法的基本的常量
const keyword_list = ['int', 'void', 'if', 'else', 'while', 'return']
const sign_list = ['=', '+', '-', '*', '=', '==', '>', '>=', '<', '<=', '!=', ';', ',', '(', ')', '{', '}','/']
const test_code1 = `/*这是用于测试的代码123*/
/*123你好*/
//123，国庆节快乐
int main()
{
    int i; //这是i
	int j;
    int k;
    int a;
    int b;
    int c;
    i = 10;
    j = 1*2*4*i+2/i/3*4;
    
	if(a>(b+c))
	{
		j=a+(b*c+1);
	}
	else
	{
		j=a; //哼哼
	}
	while(i<=(100+3))
	{
		i=j*2;
	}
    if(a>b)
    {
        i=-1;
    }
    return 0;//返回0！！！
}`

class LexicalAnalysisMachine
{
    // 构造函数
    constructor(code = test_code1)
    {
        this.code = code
        this.id_list = []
        this.res = []
    }
    // 修改代码
    updateCode(code)
    {
        this.code = code
    }
    // 获取代码
    getCode()
    {
        return this.code
    }
    // 获取程序运行的结果
    getRes()
    {
        let res = ""
        for(let i in this.res)
        {
            res += this.res[i]+'\n'
        }
        return res
    }
    // 进行初始化
    init()
    {
        this.code = ''
        this.id_list = []
        this.res = []
    }
    // 类的工具函数
    isAlpha(ch)
    {
        ch = ch.charCodeAt(0)
        if((ch>=97 && ch<=122)|(ch>=65 && ch<=90))
        {
            return true
        }
        return false
    }
    isDigit(ch)
    {
        ch = ch.charCodeAt(0)
        if(ch>=48 && ch<=57)
        {
            return true
        }
        return false
    }
    // 类的主体函数
    preprocess()
    {
        let code = this.code
        code +='#' //在尾部添加一个终结符
        // 删除//注释
        while(code.search('//')!=-1)
        {
            // 字符串中存在注释符 // 
            let start = code.search('//')  // 找到//
            let end = code.slice(start,).search('\n')+ start // 找到和//匹配的第一个\n
            if(end<=start)
            {   
                // 不存在和//匹配的换行符，那么说明是最后一行，删除掉//后的即可
                code = code.slice(0,start)
            }
            else
            {
                code = code.slice(0,start)+ code.slice(end,) // 删除//和\n之间的所有内容，但不删除\n
            }
        }
        // 删除/* */注释
        while(code.indexOf('/*')!=-1)
        {
            let start = code.indexOf('/*')  // 找到/*
            let end = code.slice(start,).indexOf(`*/`)+ start // 找到和//匹配的第一个*/
            if(end<=start)
            {   // code中存在/*但是不存在*/,出现注释未闭合，那么报错
                this.code = code
                return false;
            }
            code = code.slice(0,start)+ code.slice(end+2,) // 删除/*和*/之间的所有内容，删除/*,*/
        }
        // 删除换行符\n和\t \r
        code = code.replace(/\n/g,'')
        code = code.replace(/\t/g,'')
        code = code.replace(/\r/g,'')
        console.log(code)
        // 返回
        this.code = code
        return true
    }
    // 基本处理字符串操作
    process()
    {
        let cur = 0
        let len = this.code.length
        while(cur<len)
        {
            let pos = cur
            cur = this.analysis_word(cur)
            if(!cur)
            {
                console.log('There is an error occurs in',pos)
                console.log(this.code[pos])
                return pos
            }
            else if(cur == -1)
            {
                return -1;
            }
        }
        return -1 
    }
    // 通过cur指针来分析cur指针对应的单个有效的word
    analysis_word(cur)
    {
        let temp = this.code[cur]
        let res = ''
        let len = this.code.length-1
        if(this.isAlpha(temp))
        {
            while(this.isAlpha(this.code[cur]) || this.isDigit(this.code[cur]))
            { // Alpha or digit
                res += this.code[cur]
                cur++
                if(cur>len)
                {
                    break
                }
            }
            if(keyword_list.includes(res))
            {   // 在关键字表中
                this.res.push('<$' + res + ',->')
            }
            else
            {   // 为ID的话
                this.id_list.push(res)
                this.res.push('<$ID,' + this.id_list.length.toString() + '>')
            }
        }
        else if(this.isDigit(temp))
        { //为数字
            while(this.isDigit(this.code[cur]))
            { // digit
                res += this.code[cur]
                cur++
                if(cur>len)
                {
                    break
                }
            }
            this.res.push('<$NUM,' + res + '>')
        }
        else if(temp== '\n' || temp == ' ' || temp == '\r' || temp == '\t')
        {
            //各种换行符 tab 空格   
            cur++
        }
        else if(temp=='!')
        {
            // !的话，要检测是不是!=
            if(this.code[cur + 1] == '=')
            {
                cur += 2
                res = '!='
                this.res.push('<$' + res + ',->')
            }
            else
            {
                return false;
            }
        }
        else if (sign_list.includes(temp))
        {   // 如果是表中的符号的话
            if(temp == '=' ||temp == '<' ||temp == '>')
            {  // 查看是否是两位的符号
                if(this.code[cur + 1] == '=')
                {
                    cur += 2
                    res += temp + '='
                }
                else
                {
                    cur += 1
                    res += temp
                }
            }
            else
            {
                cur +=1
                res +=temp
            }
            this.res.push('<$' + res + ',->')
        }
        else if(temp=='#')
        {
            this.res.push('<$' + temp + ',->')
            return -1;
        }
        else
        {
            return false;
        }
        return cur
    }
    transfer()
    {
        // 将内部结果转化为可以被输出的部分
        let output = []
        for(let i in this.res)
        {
            let temp = this.res[i]
            let len = temp.length
            temp = temp.slice(1,len-1)
            temp = temp.split(',')
            let sign = temp[0]
            len = sign.length
            sign = sign.slice(1,len)//去$号
            sign = sign.toUpperCase()
            let val = temp[1]
            output.push(sign)
        }
        return output
    }
    transferNext()
    {
         // 将内部结果转化为可以被输出的部分
         let output = []
         for(let i in this.res)
         {
             let temp = this.res[i]
             let len = temp.length
             temp = temp.slice(1,len-1)
             temp = temp.split(',')
             let sign = temp[0]
             len = sign.length
             sign = sign.slice(1,len)//去$号
             sign = sign.toUpperCase()
             let val = temp[1]
             output.push([sign,val])
         }
         return output
    }
}

let MyMachine = new LexicalAnalysisMachine(test_code1)
MyMachine.preprocess()
MyMachine.process()
console.log(MyMachine.res)
console.log(MyMachine.transferNext())
console.log(MyMachine.id_list)