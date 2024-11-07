
const radialShade = `

uniform vec3 u_color;

uniform float u_amount;

vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
    float factor = texture2D(tex, uv).r * u_amount * 15.0;
    factor = clamp(factor, 0.0, 1.0);
    return vec4(u_color, factor);
}

`

export default radialShade
