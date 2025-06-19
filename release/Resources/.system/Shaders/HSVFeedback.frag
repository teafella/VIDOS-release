#include "FeedbackUtil.frag"

uniform sampler2D sampled_frame;
uniform sampler2D feedback_frame;

uniform sampler2D shape1;
uniform sampler2D shape2;

uniform mat2 rotation_mat1;
uniform float gain;

uniform float hue_shift;
uniform float fb_x;
uniform float fb_y;
uniform float fb_rotate_;
uniform mat2 fb_rotation_matrix_;
uniform float zoom_;

vec3 convolute(vec2 st, sampler2D last_tex, vec3 current_color){

	vec3 this_sample = vec3(0.0) ;
	float sample_magnitude = .25;
	this_sample += texture2D( last_tex, st  ).xyz  * sample_magnitude;
	// float sample = luma(texture2D( tex, st + vec2(-resolution_step.x, 0) ));
 //    this_sample += float(sample  < black_thresh);
 //    // this_sample += luma(texture2D( tex, st + vec2(-resolution_step.x, resolution_step.y))) * sample_magnitude;
    
	// sample = luma(texture2D( tex, st + vec2(0, -resolution_step.y)) );
 //    this_sample += float(sample  < black_thresh);
 //    // this_sample += luma(texture2D( tex, st + vec2(resolution_step.x, -resolution_step.y))) * sample_magnitude;
    
 //    // this_sample += luma(texture2D( tex, st + vec2(resolution_step.x, resolution_step.y))) * sample_magnitude;
 //    sample = luma(texture2D( tex, st + vec2(0, resolution_step.y)));
 //    this_sample += float(sample  < black_thresh);
 //    sample = luma(texture2D( tex, st + vec2(resolution_step.x, 0)));
 //    this_sample += float(sample  < black_thresh);

 //    // vec4 this_color = texture2D( tex, st );

 //   	float distance = float( this_sample > 0. && luma(frame_color) > 0.);//distance(frame_color, this_sample.xyz ) ;

    return current_color + this_sample;
}

void main( void ) {
	float feedback = cc1;
	float fb_x = cc3;
	float fb_y = cc5;
	
	float fb_zoom = cc4;
	float fb_rotate = cc6;

	float black_key = cc7;
	

	vec3 frame_color= texture2D( sampled_frame  , tcoord  ).xyz;

	vec2 fbPos = UVPage(tcoord, fb_zoom,  rotation_0, fb_y, fb_x);
	
	vec3 feedback_color =  texture2D( feedback_frame  , fbPos).xyz ;


	
	// frame_color = frame_color * edge ;

	// float decay = .5;
	// float color_mag = abs(length(feedback_color ) );
	// float color_clamp = (step(1., color_mag ) );
	
	// feedback_color = mix( feedback_color , normalize(feedback_color) * color_mag , color_clamp   );

	//keep new info in the foreground

	

	vec3 color_hsv = rgb2hsv(feedback_color );

	color_hsv.x = color_hsv.x - (hue_shift * luma(frame_color) *5.);
	if(color_hsv.y >.01){
		color_hsv.y = 1.-color_hsv.y ;
	}
	if(color_hsv.z >.01){
		color_hsv.z = 1.-color_hsv.z;
	}

	feedback_color = hsv2rgb(color_hsv) ;
	feedback_color *= feedback;



	// feedback_color = ColorClamp(feedback_color);

	// frame_color += feedback_color * feedback_scalar * feedback_amp * edge; //* float(!(frame_color.x  > 0.1 || frame_color.y  > 0.1 || frame_color.z  > 0.1)) ;

	// frame_color = convolute(tcoord, feedback_frame, frame_color);

	// frame_color += InvertColor(feedback_color); ;
	// frame_color += feedback_color;
	//keep new info in the foreground
	feedback_color = KeepForeground(frame_color, feedback_color, black_key * .5);

	frame_color = abs(feedback_color-frame_color);

	

	// // // frame_color += mix( feedback_color * feedback_scalar , vec3(0.0) , float(!(frame_color.x  < 0.1 || frame_color.y  < 0.1 || frame_color.z  < 0.1)) );
	frame_color = srgb_from_linear_srgb(frame_color);
	gl_FragColor = vec4(frame_color, 1.);
}
