import translations from './ChineseTranslations.ts'

/**
 * 根据提供的模板和替换对象进行翻译或占位符替换。
 * @param template - 需要翻译或替换的模板字符串，格式为包含{key}的字符串。
 * @param replacements - 可选的替换键值对对象，用于替换模板中的占位符。
 * @returns 替换后的字符串，若未找到对应翻译或替换值则保留原始占位符。
 */
export default function BpmnTranslator(
	template: string,
	replacements?: Record<string, any>,
): string {
	// 仅在参数为 null 或 undefined 时使用空对象
	replacements = replacements != null ? replacements : {}

	// 使用类型断言确保 template 是 translations 的有效键
	template = translations[template] || template

	// 替换时检查键是否存在，而非依赖值的真假性
	return template.replace(/{([^}]+)}/g, function (_, key) {
		return replacements[key] || '{' + key + '}'
	})
}
