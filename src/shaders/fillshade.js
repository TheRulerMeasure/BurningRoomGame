
const fillShade = `

uniform vec3 u_color;

uniform float u_amount;

vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
    vec4 texColor = texture2D(tex, uv);
    vec4 fillColor = vec4(u_color, texColor.a);
    return mix(texColor, fillColor, u_amount);
}

`

export default fillShade
