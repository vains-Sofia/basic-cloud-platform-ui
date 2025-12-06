/**
 * 企业版 BPMN 中文翻译（增强版）
 * 完整、专业、统一风格
 * 适用于：审批流、流程设计器、流程自动化平台、BPM 系统
 */

export default {
	// ============================================================
	// 工具栏（Palette）
	// ============================================================
	'Process': '流程',
	'Activate create/remove space tool': '启用空间调整工具',
	'Activate global connect tool': '启用全局连接工具',
	'Activate hand tool': '启用移动工具',
	'Activate lasso tool': '启用套索选取工具',

	'Ad-hoc': '特设子流程',
	'Ad-hoc sub-process (collapsed)': '特设子流程（折叠）',
	'Ad-hoc sub-process (expanded)': '特设子流程（展开）',
	'Collapsed Ad Hoc Sub Process': '特设子流程（折叠）',
	'Expanded Ad Hoc Sub Process': '特设子流程（展开）',
	Completion: '完成条件',
	'Cancel remaining instances': '取消剩余实例',

	'Add lane above': '向上添加泳道',
	'Add lane below': '向下添加泳道',
	'Add text annotation': '添加文本注释',
	'Text Annotation': '文本注释',

	'Append compensation activity': '在后添加补偿活动',
	'Append conditional intermediate catch event': '在后添加条件捕获事件',
	'Append end event': '在后添加结束事件',
	'Append gateway': '在后添加网关',
	'Append intermediate/boundary event': '在后添加中间/边界事件',
	'Append message intermediate catch event': '在后添加消息捕获事件',
	'Append receive task': '在后添加接收任务',
	'Append signal intermediate catch event': '在后添加信号捕获事件',
	'Append task': '在后添加任务',
	'Append timer intermediate catch event': '在后添加定时捕获事件',

	'Create data object reference': '创建数据对象引用',
	'Data Object Reference': '创建数据对象引用',
	'Create data store reference': '创建数据存储引用',
	'Data Store Reference': '数据存储引用',
	'Create end event': '创建结束事件',
	'Create expanded sub-process': '创建展开子流程',
	'Create gateway': '创建网关',
	'Create group': '创建分组',
	'Group': '分组',
	'Create intermediate/boundary event': '创建中间/边界事件',
	'Create pool/participant': '创建池/参与者',
	'Create start event': '创建开始事件',
	'Create task': '创建任务',

	// ============================================================
	// 任务（Task）
	// ============================================================
	'Business rule task': '业务规则任务',
	'Business Rule Task': '业务规则任务',
	'Call activity': '调用子流程',
	'Call Activity': '调用子流程',
	'Manual task': '手工任务',
	'Manual Task': '手工任务',
	'Receive task': '接收任务',
	'Receive Task': '接收任务',
	'Send task': '发送任务',
	'Send Task': '发送任务',
	'Script task': '脚本任务',
	'Script Task': '脚本任务',
	'Service task': '服务任务',
	'Service Task': '服务任务',
	'User task': '用户任务',
	'User Task': '用户任务',
	Task: '任务',

	Implementation: '实现方式',

	External: '外部',

	Connector: '连接器',
	'Configure Connector': '配置连接器',
	'Configure connector': '配置连接器',
	'Must configure Connector': '必须配置连接器',
	'Must configure connector': '必须配置连接器',

	'Connector Id': '连接器 ID',
	'Connector ID': '连接器 ID',

	'Create call activity': '创建子流程',

	'Called element': '调用元素',
	'In mapping propagation': '输入映射传播',
	'In mappings': '输入映射',
	'Out mapping propagation': '输出映射传播',
	'Out mappings': '输出映射',
	'Propagate all variables': '传播所有变量',
	Source: '源',
	Target: '目标',
	Local: '本地变量',
	'Source expression': '源表达式',

	// ============================================================
	// BPMN 事件（Event）
	// ============================================================

	// ---- 普通事件 ----
	'Start event': '开始事件',
	'Start Event': '开始事件',
	'End event': '结束事件',
	'End Event': '结束事件',
	'Intermediate throw event': '中间抛出事件',
	'Intermediate Throw Event': '中间抛出事件',
	'Terminate End Event': '终止事件',
	'Terminate end event': '终止事件',

	// ---- 消息事件 ----
	'Message start event': '消息开始事件',
	'Message Start Event': '消息开始事件',
	'Message start event (non-interrupting)': '消息开始事件（非中断）',
	'Message intermediate catch event': '消息捕获事件',
	'Message Intermediate Catch Event': '消息捕获事件',
	'Message intermediate throw event': '消息抛出事件',
	'Message Intermediate Throw Event': '消息抛出事件',
	'Message boundary event': '消息边界事件',
	'Message Boundary Event': '消息边界事件',
	'Message boundary event (non-interrupting)': '消息边界事件（非中断）',
	'Message Boundary Event (non-interrupting)': '消息边界事件（非中断）',
	'Message end event': '消息结束事件',
	'Message End Event': '消息结束事件',

	'Message': '消息',
	'Global message reference': '全局消息引用',

	// ---- 定时器事件 ----
	'Timer': '定时器',
	'Timer start event': '定时开始事件',
	'Timer Start Event': '定时开始事件',
	'Timer start event (non-interrupting)': '定时开始事件（非中断）',
	'Timer Start Event (non-interrupting)': '定时开始事件（非中断）',
	'Timer intermediate catch event': '定时捕获事件',
	'Timer Intermediate Catch Event': '定时捕获事件',
	'Timer boundary event': '定时边界事件',
	'Timer Boundary Event': '定时边界事件',
	'Timer boundary event (non-interrupting)': '定时边界事件（非中断）',

	// ---- 信号事件 ----
	'Signal start event': '信号开始事件',
	'Signal Start Event': '信号开始事件',
	'Signal start event (non-interrupting)': '信号开始事件（非中断）',
	'Signal Start Event (non-interrupting)': '信号开始事件（非中断）',
	'Signal intermediate catch event': '信号捕获事件',
	'Signal Intermediate Catch Event': '信号捕获事件',
	'Signal intermediate throw event': '信号抛出事件',
	'Signal Intermediate Throw Event': '信号抛出事件',
	'Signal boundary event': '信号边界事件',
	'Signal Boundary Event': '信号边界事件',
	'Signal boundary event (non-interrupting)': '信号边界事件（非中断）',
	'Signal Boundary Event (non-interrupting)': '信号边界事件（非中断）',
	'Signal end event': '信号结束事件',
	'Signal End Event': '信号结束事件',

	// ---- 错误事件 ----
	'Error start event': '错误开始事件',
	'Error Start Event': '错误开始事件',
	'Error boundary event': '错误边界事件',
	'Error Boundary Event': '错误边界事件',
	'Error end event': '错误结束事件',
	'Error End Event': '错误结束事件',

	// ---- 升级事件 ----
	'Escalation start event': '升级开始事件',
	'Escalation Start Event': '升级开始事件',
	'Escalation start event (non-interrupting)': '升级开始事件（非中断）',
	'Escalation Start Event (non-interrupting)': '升级开始事件（非中断）',
	'Escalation intermediate throw event': '升级抛出事件',
	'Escalation Intermediate Throw Event': '升级抛出事件',
	'Escalation boundary event': '升级边界事件',
	'Escalation Boundary Event': '升级边界事件',
	'Escalation boundary event (non-interrupting)': '升级边界事件（非中断）',
	'Escalation Boundary Event (non-interrupting)': '升级边界事件（非中断）',
	'Escalation end event': '升级结束事件',
	'Escalation End Event': '升级结束事件',

	// ---- 补偿事件 ----
	'Compensation start event': '补偿开始事件',
	'Compensate Start Event': '补偿开始事件',
	'Compensation intermediate throw event': '补偿抛出事件',
	'Compensate Intermediate Throw Event': '补偿抛出事件',
	'Compensation boundary event': '补偿边界事件',
	'Compensate Boundary Event': '补偿边界事件',
	'Compensation end event': '补偿结束事件',
	'Compensate End Event': '补偿结束事件',

	// ---- 条件事件 ----
	'Conditional start event': '条件开始事件',
	'Conditional Start Event': '条件开始事件',
	'Conditional start event (non-interrupting)': '条件开始事件（非中断）',
	'Conditional intermediate catch event': '条件捕获事件',
	'Conditional Intermediate Catch Event': '条件捕获事件',
	'Conditional boundary event': '条件边界事件',
	'Conditional Boundary Event': '条件边界事件',
	'Conditional boundary event (non-interrupting)': '条件边界事件（非中断）',
	'Conditional Boundary Event (non-interrupting)': '条件边界事件（非中断）',

	// ---- 链接事件 ----
	'Link intermediate catch event': '链接捕获事件',
	'Link Intermediate Catch Event': '链接捕获事件',
	'Link intermediate throw event': '链接抛出事件',
	'Link Intermediate Throw Event': '链接抛出事件',

	// ---- 边界事件 ----
	'Boundary Event': '边界事件',

	// ============================================================
	// 网关（Gateway）
	// ============================================================
	'Exclusive gateway': '排他网关',
	'Exclusive Gateway': '排他网关',
	'Parallel gateway': '并行网关',
	'Parallel Gateway': '并行网关',
	'Inclusive gateway': '包容网关',
	'Inclusive Gateway': '包容网关',
	'Complex gateway': '复杂网关',
	'Complex Gateway': '复杂网关',
	'Event-based gateway': '事件网关',
	'Event Based Gateway': '事件网关',

	// ============================================================
	// 子流程（Sub-Process）
	// ============================================================
	'Sub-process': '子流程',
	'Sub-process (collapsed)': '子流程（折叠）',
	'Collapsed Sub Process': '折叠的子流程',
	'Expanded Sub Process': '展开的子流程',
	'Sub-process (expanded)': '子流程（展开）',
	'Event sub-process': '事件子流程',

	// ============================================================
	// 泳道（Pool / Lane）
	// ============================================================
	'Lane': '泳道',
	'Collaboration': '协作',
	'Empty pool/participant': '空池',
	'Empty pool/participant (removes content)': '清空池（删除内容）',

	'Divide into two lanes': '划分为两条泳道',
	'Divide into three lanes': '划分为三条泳道',

	'Participant': '参与者',
	'Participant ID': '参与者 ID',
	'Participant Name': '参与者名称',

	'Process ID': '流程 ID',
	'Process name': '流程名称',

	// ============================================================
	// 流程连接（Flow）
	// ============================================================
	'Sequence Flow': '顺序流',
	'Sequence flow': '顺序流',
	'Default flow': '默认流',
	'Conditional flow': '条件流',

	'Connect to other element': '连接到其他元素',
	'Connect using association': '使用关联连接',
	'Connect using data input association': '使用数据输入关联',
	'Connect using sequence/message flow or association': '连接（顺序流/消息流/关联）',

	// ============================================================
	// 属性面板（Properties Panel）
	// ============================================================

	// ---- 基础属性 ----
	Id: 'ID',
	Name: '名称',
	General: '常规',
	Details: '详情',
	Documentation: '文档',
	Priority: '任务优先级',
	'Version tag': 'Version tag',
	'Time to live': '保留时长',
	'Extension properties': '扩展属性',
	'Element documentation': '元素文档',
	'Process documentation': '流程文档',
	'Create new list item': '添加列表项',
	'Created in': '创建于',
	'Process variables': '流程变量',
	'This maps to the process definition key.': '该值将映射为流程定义的 Key。',

	// ---- 执行设置 ----
	Executable: '可执行',
	Initiator: '发起人',
	Exclusive: '排他执行',

	'Asynchronous Continuations': '异步延续',
	'Asynchronous continuations': '异步延续',
	Before: '前置异步',
	After: '后置异步',
	'Asynchronous Before': '前置异步',
	'Asynchronous before': '前置异步',
	'Asynchronous after': '后置异步',

	// ---- 补充 ----
	'History cleanup': '历史清理',
	Tasklist: '任务列表',
	Startable: '可启动',

	// ---- 历史设置 ----
	'History time to live': '历史保留时长',

	// ---- 表单 ----
	Type: '类型',
	Forms: '表单',
	'Form key': '表单 Key',
	'Form fields': '表单字段',
	'Business key': '业务 Key',

	// ---- 属性 ----
	Properties: '属性',
	'Add property': '添加属性',

	// ---- 执行监听器 ----
	'Execution listeners': '执行监听器',
	'Execution listener': '执行监听器',
	'Event type': '事件类型',
	'Task listeners': '任务监听器',
	'Listener type': '监听器类型',
	'Listener ID': '监听器 ID',

	'Job execution': '任务执行',
	'Job priority': '任务优先级',
	'Retry time cycle': '重试周期',

	'Java class': 'Java 类',
	Expression: '表达式',
	'Delegate expression': '委托表达式',
	'Condition Expression': '条件表达式',

	// ---- 脚本 ----
	Script: '脚本',
	'Script Format': '脚本格式',
	Format: '格式',

	'Script type': '脚本类型',
	'Inline script': '内联脚本',
	'External resource': '外部资源',

	Resource: '资源',

	// ---- 字段注入 ----
	Inputs: '输入',
	Outputs: '输出',
	'Input/Output': '输入 / 输出',
	'Input parameters': '输入参数',
	'Output parameters': '输出参数',
	'Result variable': '结果变量',
	'Assignment type': '赋值类型',
	'Local variable name': '局部变量名',
	'Start typing "${}" to create an expression.': '输入 ${} 以创建表达式。',
	'Process variable name': '流程变量名',

	Variables: '变量',
	'List values': '列表值',
	'Map entries': '映射项',

	Extensions: '扩展',
	'Field injection': '字段注入',
	'Field injections': '字段注入',

	// ---- 定时器 ----
	'Timer definition type': '定时器类型',
	'Timer definition': '定时器定义',
	Date: '日期',
	Duration: '持续时间',
	Cycle: '循环',

	// ---- 信号/升级/错误 ----
	Signal: '信号',
	'Signal name': '信号名称',
	Escalation: '升级',
	Error: '错误',

	'Link Name': '链接名称',
	'Link name': '链接名称',

	Condition: '条件',
	'Variable Name': '变量名称',
	'Variable name': '变量名称',
	'Variable Event': '变量事件',
	'Variable event': '变量事件',
	'Specify more than one variable change event as a comma separated list.':
		'多个变量事件使用逗号分隔。',

	// ---- 多实例 ----
	'Multi instance': '多实例',
	'Loop cardinality': '实例数量',
	'Element variable': '元素变量',
	'Completion condition': '完成条件',

	// ---- 人员设置 ----
	Assignee: '负责人',
	'Start initiator': '启动发起人',
	'Candidate users': '候选用户',
	'Candidate groups': '候选用户组',
	'Due date': '到期时间',
	'Follow up date': '跟进时间',

	'User assignment': '用户分配',
	'Candidate starter': '候选发起者',
	'Candidate starter users': '候选发起用户',
	'Candidate starter groups': '候选发起用户组',
	'Specify more than one user as a comma separated list.': '多个用户请用逗号分隔。',
	'Specify more than one group as a comma separated list.': '多个用户组请用逗号分隔。',
	'The follow up date as an EL expression (e.g. ${someDate}) or an ISO date (e.g. 2015-06-26T09:54:00).':
		'跟进时间可为 EL 表达式（如 ${someDate}）或 ISO 日期（如 2015-06-26T09:54:00）。',
	'The due date as an EL expression (e.g. ${someDate}) or an ISO date (e.g. 2015-06-26T09:54:00).':
		'到期时间可为 EL 表达式（如 ${someDate}）或 ISO 日期（如 2015-06-26T09:54:00）。',

	// ---- 外部任务 ----
	'External task': '外部任务',
	'Task priority': '任务优先级',
	Topic: '主题',

	// ============================================================
	// 导入/错误提示（Import / Validation）
	// ============================================================
	'failed to import {element}': '导入 {element} 失败',
	'element required': '缺少必要元素',
	'no diagram to display': '无可显示的流程图',
	'no shape type specified': '未指定图形类型',
	'multiple DI elements defined for {element}': '{element} 定义了多个 DI 元素',
	'no bpmnElement referenced in {element}': '{element} 未引用 bpmnElement',
	'diagram not part of bpmn:Definitions': '流程图未包含在 bpmn:Definitions 中',

	// ============================================================
	// 补充
	// ============================================================
	'Change element': '更改元素',
	'Search in diagram': '在图中搜索',
	Remove: '移除',
	Delete: '删除',
	'Open {element}': '打开 {element}',
} as { [key: string]: string }
