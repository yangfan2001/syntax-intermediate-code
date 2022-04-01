//定义文件的基本动作

/*定义选择代码文件表单的基本事件*/
$('#selectCode').change(function (e) { 
    e.preventDefault();
    fileMsg = e.currentTarget.files;
    let fileName = fileMsg[0].name;
    console.log(fileName);//js-dom.png
    //类型 
    let fileType = fileMsg[0].type;
    console.log(fileType);//image/png
    let file = fileMsg[0]
    if(file) //如果文件上传成功
    {  // 创建filereader对象
        let reader= new FileReader()
        reader.readAsText(file,'UTF-8') // 以UTF-8编码格式读取文件
        reader.onload = function (e) {//读取文件内容
            $('#inputCode').val(this.result); // 对textarea进行赋值操作
        }
    }
});

function getTextInput()
{
    let code = $('#inputCode').val();
    return code
}
// 词法分析反馈
function SyntacticReact(code)
{
    MyMachine.init() //初始化
    MyMachine.updateCode(code) // 加载用户输入的代码到对象中
    if(MyMachine.preprocess()==false)
    { // 预处理存在错误
        $('#Modal').modal('show')
        $('#ModalBody').empty();// 清空模态框
        $('#ModalBody').append(`<text>注释未闭合
        </text>`);
        return false
    }
    else
    {
        let pos = MyMachine.process() // 进行词法分析
        if(pos==-1)
        {
            res = MyMachine.getRes()
            return MyMachine.transferNext()
        }
        else
        {
            $('#ModalHead').empty()
            $('#ModalHead').append('<h4 class="modal-title">错误提示❌/h4>')
            $('#Modal').modal('show')
            console.log()
            $('#ModalBody').empty();// 清空模态框
            $('#ModalBody').append(`<text>${MyMachine.getCode().slice(0,pos)}
            <mark>${MyMachine.getCode()[pos]}</mark>
            </text>`);
            return false
        }
    }
}

// 语法分析反馈
function GrammarReact(code,grammar)
{
    let tmp = []
    for(let i in code)
    {
        if(code[i]!='')
        {
            tmp.push(code[i])
        }
    }
    console.log(grammar)
    console.log(tmp)
    let content = grammar
    let firstPos = content.indexOf('\n')
    let firstLine = content.substr(0,firstPos)
    content = content.substr(firstPos+1)
    let secondPos = content.indexOf('\n')
    let secondLine = content.substr(0,secondPos)
    let Vn =firstLine.split(' ') ,Vt=secondLine.split(' ')
    content = content.substr(secondPos+1)
    my_grammar.load_grammar(Vn,Vt,content)
    let status = my_grammar.read_str(tmp)
    my_gen.process(my_grammar.output,MyMachine.id_list)
    let info = my_gen.output_quad()
    console.log(info)
    $('#ProcessRes').val(info);
    

    if(!status)//失败了
    {
        let str = ''
        for(let i in code)
        {
            if(i==my_grammar.wrongPos)
            {
                str+=` <mark>${code[i][0]}</mark>`
            }
            else
            {
                str+=`<text>${code[i][0]}</text>`
            }
        }
        $('#Modal').modal('show')
        $('#ModalBody').empty();// 清空模态框
        $('#ModalBody').append(str);
    }
    if(my_gen.errorFlag)
    {
        $('#Modal').modal('show')
        $('#ModalBody').empty()// 清空模态框
        $('#ModalBody').append(`<mark>${my_gen.errorINFO}</mark>`)
    }
}
// 定义提交按钮点击的基本事件
$('#submitButton').click(function (e) { 
    e.preventDefault();
    let code = getTextInput()
    let grammar = test_gm
    let SyntacticRes = SyntacticReact(code)
    if(SyntacticRes)//词法分析器进行响应)
    {
        GrammarReact(SyntacticRes,grammar)
    }
    
});
// 定义显示语法点击的基本事件
$('#checkGmButton').click(function (e) { 

    $('#Modal2').modal('show')
    e.preventDefault();
    $('#ModalHead2').empty()
    $('#ModalHead2').append('<h4 class="modal-title">LL1文法</h4>')
    let content = test_code
    $('#ModalWindow').append(test_code)
});
// 定义填充案例按钮点击的基本事件
$('#fillExample').click(function (e) { 
    e.preventDefault();
    $('#inputCode').val(test_code1);
});






//实现Map转化为文本形式
function MapToStr(name,my_map)
{
    res = `${name}集合的结果为:\n`
    for(let item of my_map.entries())
    {
        res+=`${name}{${item[0]}}->{`
        for(let sign of item[1])
        {
            res+=sign+','
        }
        res+=`}\n`
    }
    res+=`\n`
    return res
}