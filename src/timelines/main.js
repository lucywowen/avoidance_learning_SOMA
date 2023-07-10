import jsPsychLearning from '../js/learning-trials';
import jsPsychProbe from '../js/probe';
import jsPsychFullscreen from '@jspsych/plugin-fullscreen';
import jsPsychInstructions from '@jspsych/plugin-instructions';
import jsPsychComprehension from '../js/comprehension';
import jsPsychMyInstructions from '../js/instructions';
import jsPsychPractice from '../js/practice';
import jsPsychHtmlSliderResponse from '@jspsych/plugin-html-slider-response';
import jsPsychSurveyMultiChoice from '@jspsych/plugin-survey-multi-choice';
import jsPsychCallFunction from '@jspsych/plugin-call-function';
import jsPsychImageKeyboardResponse from '@jspsych/plugin-image-keyboard-response';
import jsPsychHtmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
// import jspsychPluginHtml from '@adp-psych/jspsych-plugin-html';
import 'jspsych/css/jspsych.css';
import '../css/robots-css.min.css';
import { images } from '../lib/utils';

// Add your jsPsych options here.
// Honeycomb will combine these custom options with other options needed by Honyecomb.
const jsPsychOptions = {
  on_trial_finish: function (data) {
    if (typeof data.value == 'undefined') {
      data.value = 'replacement';
    }
    if (typeof data.subject_id == 'undefined') {
      data.subject_id = 'replacement';
    }
    if (typeof data.missed_code == 'undefined') {
      data.missed_code = 'replacement';
    }
    if (typeof data.display_code == 'undefined') {
      data.display_code = 'replacement';
    }
    if (typeof data.response_code == 'undefined') {
      data.response_code = 'replacement';
    }
    if (typeof data.feedback_code == 'undefined') {
      data.feedback_code = 'replacement';
    }
    console.log(data);
  },
};

function buildTimeline(jsPsych) {
  // Define unique symbols.
  var symbol_array = [
    'c',
    'd',
    'e',
    'f',
    'j',
    'k',
    'm',
    'o',
    'x',
    's',
    't',
    'y',
    'C',
    'N',
    'O',
    'L',
    'T',
    'X',
  ];
  // Shuffle symbols.
  symbol_array = jsPsych.randomization.repeat(symbol_array, 1);
  var symbol_array_1 = symbol_array.slice(0, 9);
  // var symbol_array_2 = symbol_array.slice(9, 18);

  // Define the contexts.
  var practice_array = ['forrest_1', 'desert_1'];
  var learn_1_array = ['forrest_2', 'desert_4'];
  // var learn_2_array = ['forrest_4', 'desert_3'];

  console.log(symbol_array_1);
  // console.log(symbol_array_2);

  // Randomize the contexts.
  var context_array = jsPsych.randomization.repeat(practice_array, 1);
  context_array = context_array.concat(['gray']);
  context_array = context_array.concat(jsPsych.randomization.repeat(learn_1_array, 1));
  // context_array = context_array.concat(['gray']);
  // context_array = context_array.concat(jsPsych.randomization.repeat(learn_2_array, 1));

  var debug = true;

  // Define missed repsonses count.
  var missed_threshold = 10;
  var missed_responses = 0;

  // Define correct responses
  var correct_trial_count = 0;
  var total_trial_count = 0;

  // Define probabilities (default is all 75/25%)
  var reward_probs_a = 0.75;
  var reward_probs_b = 0.75;

  // Define counterfactual
  var cf = true;
  var font_size = 24;

  //---------------------------------------//
  // Define learning phase instructions.
  //---------------------------------------//

  var instructions_000 = {
    type: jsPsychImageKeyboardResponse,
    stimulus: images['keyboard.png'],
    stimulus_height: 400,
    prompt:
      '<p style="font-size:' +
      font_size +
      'px;">Welcome to the experiment. You can press the Left and Right arrow keys to move through the instructions.</p>',
  };

  var instructions_00 = {
    type: jsPsychInstructions,
    pages: [
      '<p style="font-size:' +
        font_size +
        'px;">We are first going to start with a few questions about your pain levels.',
    ],
  };

  var pain_01 = {
    type: jsPsychHtmlSliderResponse,
    labels: [
      '<p style="font-size:' + font_size + 'px;">no pain',
      '<p style="font-size:' + font_size + 'px;">worst imaginable',
    ],
    stimulus:
      '<p style="font-size:' +
      font_size +
      'px;">Averaged over the past week, how intense is your pain?</p>',
  };

  var pain_02 = {
    type: jsPsychHtmlSliderResponse,
    labels: [
      '<p style="font-size:' + font_size + 'px;">no pain',
      '<p style="font-size:' + font_size + 'px;">worst imaginable',
    ],
    stimulus:
      '<p style="font-size:' +
      font_size +
      'px;">Averaged over the past week, how unpleasant is your pain?</p>',
  };

  var pain_03 = {
    type: jsPsychHtmlSliderResponse,
    labels: [
      '<p style="font-size:' + font_size + 'px;">no pain',
      '<p style="font-size:' + font_size + 'px;">worst imaginable',
    ],
    stimulus:
      '<p style="font-size:' +
      font_size +
      'px;">How much has your pain interfered with your activities <br> over the past week?</p>',
  };

  var pain_04 = {
    type: jsPsychSurveyMultiChoice,
    questions: [
      {
        prompt: 'How long have you been in pain?',
        name: 'Pain Duration',
        options: [
          'I am not in pain',
          '< 2 weeks',
          '2-4 weeks',
          '1 – 3 months',
          '3 – 6 months',
          '6 – 12 months',
          '1 – 5 years',
          '> 5 years',
          '> 10 years',
        ],
        required: true,
      },
    ],
  };

  var instructions_01 = {
    type: jsPsychMyInstructions,
    pages: [
      'We are now starting the experiment.<br><br>Use the left/right arrow keys to navigate the instructions.',
      'In this task, you are picking a team of knights.<br>The knights will look like the ones below.',
      'Each knight will have a <b>unique symbol</b> on its chestplate.<br>This symbol will help you identify each knight.',
      "You'll also pick your team of knights from different places, either the desert or forest.",
      'On every turn, you will choose a knight for your team.<br>When you select a knight, it may give you:<br><b><font color=#01579b>+$2, </font><font color=#303030>+0 dollars</font></b>, or <b><font color=#A41919>-$2</font></b>.',
      "Once you've selected your knight, their platform and visor will light up to indicate your choice.",
      'To help you learn, we will also show you the dollars you<br><i>could have earned</i> if you had chosen the other knight.<br><b>NOTE:</b> You will earn dollars only for the knight you chose.',
      'Some knights are better than others. Some will gain dollars while others will avoid losing dollars. Try to earn as many dollars as you can.',
      "Now let's practice with the knights below. Using the left/right<br>arrow keys, select the knights for testing and try to learn<br>which will give you more dollars.",
      '<b>HINT:</b> You can differentiate between the knights based on the symbols on their chestplate.  Try to avoid losing dollars.',
    ],
    symbol_L: 'V',
    symbol_R: 'U',
  };

  var practice_block_01 = {
    type: jsPsychPractice,
    symbol_L: 'V',
    symbol_R: 'U',
    outcome_L: 'zero',
    outcome_R: 'win',
    context: context_array[0],
    choices: ['arrowleft', 'arrowright'],
    correct: 'arrowright',
    feedback_duration: 2000,
  };

  const instructions_02 = {
    type: jsPsychMyInstructions,
    pages: ["Great job! Now let's try for one more set of knights."],
    symbol_L: 'W',
    symbol_R: 'R',
  };

  var practice_block_02 = {
    type: jsPsychPractice,
    symbol_L: 'W',
    symbol_R: 'R',
    outcome_L: 'lose',
    outcome_R: 'zero',
    context: context_array[1],
    choices: ['arrowleft', 'arrowright'],
    correct: 'arrowright',
    feedback_duration: 2000,
  };

  const instructions_03 = {
    type: jsPsychMyInstructions,
    pages: [
      'During the task, there will be many different knights to choose from.<br>Remember to pay close attention to their symbols on their chestplates.',
      'Your job is to try to select the best knight in each pair.<br>Even though you will learn the outcomes for both knights,<br>you will only earn dollars for the knight you choose.',
      '<b>HINT:</b> The knights may not always give you dollars, but some knights are better at gaining dollars while other knights are better at avoiding losing dollars.',
      "You should try to earn as many dollars as you can, even if it's not possible to win dollars or avoid losing dollars on every round.",
      "At the end of the task, the total number of dollars you've earned will be converted into a performance percentage. You can earn up to an additional $4 based on your performance.",
      'Next, we will ask you some questions about the task.<br>You must answer all the questions correctly to be able to continue.',
    ],
    symbol_L: ' ',
    symbol_R: ' ',
  };

  var comprehension = {
    type: jsPsychComprehension,
  };

  // Define comprehension threshold.
  var max_errors = 0;
  var max_loops = 3;
  var num_loops = 0;

  if (debug) {
    var instructions = {
      timeline: [instructions_00],
    };
  } else {
    instructions = {
      timeline: [
        instructions_000,
        instructions_00,
        pain_01,
        pain_02,
        pain_03,
        pain_04,
        instructions_01,
        practice_block_01,
        instructions_02,
        practice_block_02,
        instructions_03,
        comprehension,
      ],

      // }
      loop_function: function (data) {
        // Extract number of errors.
        const num_errors = data.values().slice(-1)[0].num_errors;

        // Check if instructions should repeat.
        if (num_errors > max_errors) {
          console.log(num_errors);
          num_loops++;
          if (num_loops >= max_loops) {
            low_quality = true;
            return false;
          } else {
            return true;
          }
        } else {
          return false;
        }
      },
    };
  }

  var comprehension_check = {
    type: jsPsychCallFunction,
    func: function () {},
    on_finish: function () {
      if (low_quality) {
        jsPsych.endExperiment();
      }
    },
  };

  var ready = {
    type: jsPsychInstructions,
    pages: [
      '<p style="font-size:' + font_size + 'px;">Great job! You passed the comprehension check.',
      '<p style="font-size:' +
        font_size +
        'px;">Get ready to begin the experiment.<br>Press the right arrow key when you are ready to start.',
    ],
  };

  // // //---------------------------------------//
  // // // Define probe phase instructions.
  // // //---------------------------------------//

  var instructions_05 = {
    type: jsPsychInstructions,
    pages: () => {
      return [
        '<p style="font-size:' +
          font_size +
          'px;">That is the end of the learning phase. Great job! You have made ' +
          Math.round((correct_trial_count / total_trial_count) * 100) +
          '% correct',
      ];
    },
  };

  // //---------------------------------------//
  // // Define learning phase 1.
  // //---------------------------------------//
  // // Learning blocks are comprised of
  // // 24 presentations of 4 unique stimulus
  // // pairs (96 total trials). With left/right
  // // side counterbalancing, this is 12
  // // presentations per unique pair / side.

  // Initialize phase array.
  var learning_phase_1 = [];
  var low_quality;
  var val;
  var color;
  var not_reduced_a;
  var not_reduced_b;
  var not_reduced_diff_a;
  var not_reduced_diff_b;
  var arr_1;
  var arr_2;
  var diff_arr_1;
  var diff_arr_2;
  var reward_prob;
  var iters;
  var probe_iters;
  var context_iters;
  // var symbol_L_missed;
  // var symbol_R_missed;
  // var outcome_L_missed;
  // var outcome_R_missed;
  // var probs_missed;
  // var cf_missed;
  // var context_missed;

  if (debug) {
    iters = 2;
    probe_iters = 3;
    context_iters = 1;
  } else {
    iters = 12;
    probe_iters = 9;
    context_iters = 3;
  }

  // Iteratively define trials
  for (var i = 0; i < iters; i++) {
    // Initialize (temporary) trial array.
    const trials = [];
    const missed = [];

    // Iterate over unique pairs.
    for (var j = 0; j < 4; j++) {
      // Define metadata.

      not_reduced_a = reward_probs_a * 100;
      not_reduced_diff_a = 100 - not_reduced_a;
      not_reduced_b = reward_probs_b * 100;
      not_reduced_diff_b = 100 - not_reduced_b;

      if (j == 0) {
        val = 'win';
        arr_1 = Array(not_reduced_a).fill('zero');
        diff_arr_1 = Array(not_reduced_diff_a).fill(val);
        arr_1 = arr_1.concat(diff_arr_1);
        arr_2 = Array(not_reduced_a).fill(val);
        diff_arr_2 = Array(not_reduced_diff_a).fill('zero');
        arr_2 = arr_2.concat(diff_arr_2);
        reward_prob = reward_probs_a;
        color = context_array[3];
      } else if (j == 1) {
        val = 'lose';
        arr_1 = Array(not_reduced_a).fill('zero');
        diff_arr_1 = Array(not_reduced_diff_a).fill(val);
        arr_1 = arr_1.concat(diff_arr_1);
        arr_2 = Array(not_reduced_a).fill(val);
        diff_arr_2 = Array(not_reduced_diff_a).fill('zero');
        arr_2 = arr_2.concat(diff_arr_2);
        reward_prob = reward_probs_a;
        color = context_array[4];
      } else if (j == 2) {
        val = 'win';
        arr_1 = Array(not_reduced_b).fill('zero');
        diff_arr_1 = Array(not_reduced_diff_b).fill(val);
        arr_1 = arr_1.concat(diff_arr_1);
        arr_2 = Array(not_reduced_b).fill(val);
        diff_arr_2 = Array(not_reduced_diff_b).fill('zero');
        arr_2 = arr_2.concat(diff_arr_2);
        reward_prob = reward_probs_b;
        color = context_array[3];
        console.log(color);
      } else {
        val = 'lose';
        arr_1 = Array(not_reduced_b).fill('zero');
        diff_arr_1 = Array(not_reduced_diff_b).fill(val);
        arr_1 = arr_1.concat(diff_arr_1);
        arr_2 = Array(not_reduced_b).fill(val);
        diff_arr_2 = Array(not_reduced_diff_b).fill('zero');
        arr_2 = arr_2.concat(diff_arr_2);
        reward_prob = reward_probs_b;
        color = context_array[4];
      }

      // Append trial (LR).
      var LR = {
        type: jsPsychLearning,
        symbol_L: symbol_array_1[2 * j + 0],
        symbol_R: symbol_array_1[2 * j + 1],
        outcome_L: jsPsych.randomization.sampleWithoutReplacement(arr_2, 1)[0],
        outcome_R: jsPsych.randomization.sampleWithoutReplacement(arr_1, 1)[0],
        probs: reward_prob,
        counterfactual: cf,
        context: color,
        choices: ['arrowleft', 'arrowright'],
        correct: val == 'win' ? 'arrowleft' : 'arrowright',
        data: { block: 1 },
        on_finish: function (data) {
          // Evaluate missing data
          if (data.rt == null) {
            // Set missing data to true.
            data.missing = true;

            // Increment counter. Check if experiment should end.
            missed_responses++;
            if (missed_responses >= missed_threshold) {
              low_quality = true;
              jsPsych.endExperiment();
            }

            // var missed_LR = {
            //   // missed.push({
            //   type: jsPsychLearning,
            //   // store any parameters that you need to re-create this trial in the missed array, so that it can be repeated later
            //   symbol_L: symbol_array_1[2 * j + 1],
            //   symbol_R: symbol_array_1[2 * j + 0],
            //   outcome_L: jsPsych.randomization.sampleWithoutReplacement(arr_1, 1)[0],
            //   outcome_R: jsPsych.randomization.sampleWithoutReplacement(arr_2, 1)[0],
            //   probs: reward_prob,
            //   counterfactual: cf,
            //   context: color,
            //   choices: ['arrowleft', 'arrowright'],
            //   correct: val == 'win' ? 'arrowright' : 'arrowleft',
            //   data: { block: 1 },
            //   // });
            //   // };
            //   on_finish: function (data) {
            //     // Evaluate missing data
            //     if (data.rt == null) {
            //       // Set missing data to true.
            //       data.missing = true;

            //       // Increment counter. Check if experiment should end.
            //       missed_responses++;
            //       if (missed_responses >= missed_threshold) {
            //         low_quality = true;
            //         jsPsych.endExperiment();
            //       }

            //       var missed_again_LR = {
            //         // missed.push({
            //         type: jsPsychLearning,
            //         // store any parameters that you need to re-create this trial in the missed array, so that it can be repeated later
            //         symbol_L: symbol_array_1[2 * j + 1],
            //         symbol_R: symbol_array_1[2 * j + 0],
            //         outcome_L: jsPsych.randomization.sampleWithoutReplacement(arr_1, 1)[0],
            //         outcome_R: jsPsych.randomization.sampleWithoutReplacement(arr_2, 1)[0],
            //         probs: reward_prob,
            //         counterfactual: cf,
            //         context: color,
            //         choices: ['arrowleft', 'arrowright'],
            //         correct: val == 'win' ? 'arrowright' : 'arrowleft',
            //         data: { block: 1 },
            //         // });
            //       };
            //       // Define looping node.
            //       const missed_again_LR_node = {
            //         timeline: [missed_again_LR],
            //         loop_function: function (data) {
            //           return data.values()[0].missing;
            //         },
            //       };
            //       missed.push(missed_again_LR_node);
            //     } else {
            //       // Set missing data to false.
            //       data.missing = false;
            //       total_trial_count++;
            //       if (data.accuracy == 1) {
            //         correct_trial_count++;
            //       }
            //     }
            //     console.log(low_quality);
            //   },
            // };
            // // Define looping node.
            // const missed_LR_node = {
            //   timeline: [missed_LR],
            //   loop_function: function (data) {
            //     return data.values()[0].missing;
            //   },
            // };
            // missed.push(missed_LR_node);
          } else {
            // Set missing data to false.
            data.missing = false;
            total_trial_count++;
            if (data.accuracy == 1) {
              correct_trial_count++;
            }
          }
          console.log(low_quality);
        },
      };

      // Define looping node.
      const LR_node = {
        timeline: [LR],
        loop_function: function (data) {
          return data.values()[0].missing;
        },
      };
      trials.push(LR_node);

      // Append trial (RL).
      var RL = {
        type: jsPsychLearning,
        symbol_L: symbol_array_1[2 * j + 1],
        symbol_R: symbol_array_1[2 * j + 0],
        outcome_L: jsPsych.randomization.sampleWithoutReplacement(arr_1, 1)[0],
        outcome_R: jsPsych.randomization.sampleWithoutReplacement(arr_2, 1)[0],
        probs: reward_prob,
        counterfactual: cf,
        context: color,
        choices: ['arrowleft', 'arrowright'],
        correct: val == 'win' ? 'arrowright' : 'arrowleft',
        data: { block: 1 },
        on_finish: function (data) {
          // Evaluate missing data
          if (data.rt == null) {
            // Set missing data to true.
            data.missing = true;

            // Increment counter. Check if experiment should end.
            missed_responses++;
            if (missed_responses >= missed_threshold) {
              low_quality = true;
              jsPsych.endExperiment();
            }

            // var missed_RL = {
            //   // missed.push({
            //   type: jsPsychLearning,
            //   // store any parameters that you need to re-create this trial in the missed array, so that it can be repeated later
            //   symbol_L: symbol_array_1[2 * j + 1],
            //   symbol_R: symbol_array_1[2 * j + 0],
            //   outcome_L: jsPsych.randomization.sampleWithoutReplacement(arr_1, 1)[0],
            //   outcome_R: jsPsych.randomization.sampleWithoutReplacement(arr_2, 1)[0],
            //   probs: reward_prob,
            //   counterfactual: cf,
            //   context: color,
            //   choices: ['arrowleft', 'arrowright'],
            //   correct: val == 'win' ? 'arrowright' : 'arrowleft',
            //   data: { block: 1 },
            //   // });
            //   // };
            //   on_finish: function (data) {
            //     // Evaluate missing data
            //     if (data.rt == null) {
            //       // Set missing data to true.
            //       data.missing = true;

            //       // Increment counter. Check if experiment should end.
            //       missed_responses++;
            //       if (missed_responses >= missed_threshold) {
            //         low_quality = true;
            //         jsPsych.endExperiment();
            //       }

            //       var missed_again_RL = {
            //         // missed.push({
            //         type: jsPsychLearning,
            //         // store any parameters that you need to re-create this trial in the missed array, so that it can be repeated later
            //         symbol_L: symbol_array_1[2 * j + 1],
            //         symbol_R: symbol_array_1[2 * j + 0],
            //         outcome_L: jsPsych.randomization.sampleWithoutReplacement(arr_1, 1)[0],
            //         outcome_R: jsPsych.randomization.sampleWithoutReplacement(arr_2, 1)[0],
            //         probs: reward_prob,
            //         counterfactual: cf,
            //         context: color,
            //         choices: ['arrowleft', 'arrowright'],
            //         correct: val == 'win' ? 'arrowright' : 'arrowleft',
            //         data: { block: 1 },
            //         // });
            //       };
            //       // Define looping node.
            //       const missed_again_RL_node = {
            //         timeline: [missed_again_RL],
            //         loop_function: function (data) {
            //           return data.values()[0].missing;
            //         },
            //       };
            //       trials.push(missed_again_RL_node);
            //     } else {
            //       // Set missing data to false.
            //       data.missing = false;
            //       total_trial_count++;
            //       if (data.accuracy == 1) {
            //         correct_trial_count++;
            //       }
            //     }
            //     console.log(low_quality);
            //   },
            // };
            // // Define looping node.
            // const missed_RL_node = {
            //   timeline: [missed_RL],
            //   loop_function: function (data) {
            //     return data.values()[0].missing;
            //   },
            // };
            // trials.push(missed_RL_node);
          } else {
            // Set missing data to false.
            data.missing = false;
            total_trial_count++;
            if (data.accuracy == 1) {
              correct_trial_count++;
            }
          }
          console.log(low_quality);
        },
      };

      // Define looping node.
      const RL_node = {
        timeline: [RL],
        loop_function: function (data) {
          return data.values()[0].missing;
        },
      };
      trials.push(RL_node);
    }
    // console.log(missed);
    // Shuffle trials. Append.
    learning_phase_1 = learning_phase_1.concat(jsPsych.randomization.repeat(trials, 1));
    // learning_phase_1 = learning_phase_1.concat(jsPsych.randomization.repeat(missed, 1));

    // var missed_trial = {
    //   type: jsPsychLearning,
    //   symbol_L: missed[trial_index].symbol_L,
    //   symbol_R: missed[trial_index].symbol_R,
    //   outcome_L: missed[trial_index].outcome_L,
    //   outcome_R: missed[trial_index].outcome_R,
    //   probs: missed[trial_index].reward_prob,
    //   counterfactual: missed[trial_index].cf,
    //   context: missed[trial_index].color,
    //   choices: ['arrowleft', 'arrowright'],
    //   correct: val == 'win' ? 'arrowright' : 'arrowleft',
    //   data: { block: 1 },
    //   on_finish: function (data) {
    //     // Evaluate missing data
    //     if (data.rt == null) {
    //       // Set missing data to true.
    //       data.missing = true;

    //       // Increment counter. Check if experiment should end.
    //       missed_responses++;
    //       if (missed_responses >= missed_threshold) {
    //         low_quality = true;
    //         jsPsych.endExperiment();
    //       }

    //       // missed.push({
    //       //   // store any parameters that you need to re-create this trial in the missed array, so that it can be repeated later
    //       //   symbol_L: jsPsych.currentTrial().symbol_L,
    //       //   symbol_R: jsPsych.currentTrial().symbol_R,
    //       //   outcome_L: jsPsych.currentTrial().outcome_L,
    //       //   outcome_R: jsPsych.currentTrial().outcome_R,
    //       //   probs: jsPsych.currentTrial().probs,
    //       //   cf: jsPsych.currentTrial().cf,
    //       //   context: jsPsych.currentTrial().context,
    //       // });
    //     } else {
    //       // Set missing data to false.
    //       data.missing = false;
    //       total_trial_count++;
    //       if (data.accuracy == 1) {
    //         correct_trial_count++;
    //       }
    //     }
    //     console.log(low_quality);
    //   },
    // };

    var trial_index = 0; // initialize to 0 so that you start with the first element in the missed array

    var missed_trial_loop = {
      timeline: [missed],
      loop_function: function () {
        trial_index++; // after each missed trial, increment the trial index and see if there are any trials left to run in the missed array
        if (trial_index < missed_responses) {
          return false;
        } else {
          return false;
        }
      },
    };
    var missed_trial_loop_conditional = {
      timeline: [missed_trial_loop],
      conditional_function: function () {
        if (missed.length > 0) {
          return true;
        } else {
          return false;
        }
      },
    };

    learning_phase_1.push(missed_trial_loop_conditional);
  }

  //------------------------------------//
  // Define probe phase 1.
  //------------------------------------//
  // Probe phases are comprised of
  // every possible pair combination (8 previous stimuli and 1 new stimulus)
  // (36 in total) presented 4 times
  // (144 total trials). Each presented 3 times
  // either neutral (gray) background or
  // 2 other contexts (reward or punishment) (432 trials total).

  // Initialize phase array.
  var probe_phase_1 = [];
  // Iteratively define trials
  // for (i = 0; i < 8; i++) {
  for (var p = 0; p < probe_iters; p++) {
    // for (j = 0; j < 8; j++) {
    for (var q = 0; q < probe_iters; q++) {
      for (var c = 0; c < context_iters; c++) {
        if (p != q) {
          // Append trial.
          var probe = {
            type: jsPsychProbe,
            symbol_L: symbol_array_1[p],
            symbol_R: symbol_array_1[q],
            context: context_array[4 - c],
            choices: ['arrowleft', 'arrowright'],
            data: { block: 1 },
            on_finish: function (data) {
              // Evaluate missing data
              if (data.rt == null) {
                // Set missing data to true.
                data.missing = true;

                // Increment counter. Check if experiment should end.
                missed_responses++;
                if (missed_responses >= missed_threshold) {
                  low_quality = true;
                  jsPsych.endExperiment();
                }
              } else {
                // Set missing data to false.
                data.missing = false;
              }
            },
          };

          // Define looping node.
          const probe_node = {
            timeline: [probe],
            loop_function: function (data) {
              return data.values()[0].missing;
            },
          };

          // Add trials twice.
          probe_phase_1.push(probe_node);
          // probe_phase_1.push(probe_node);
        }
      }
    }
  }

  // Shuffle trials.
  probe_phase_1 = jsPsych.randomization.repeat(probe_phase_1, 1);

  // Complete screen
  var complete = {
    type: jsPsychInstructions,
    pages: () => {
      return [
        '<p style="font-size:' +
          font_size +
          'px;">Great job! You have completed the experiment. You have made ' +
          Math.round((correct_trial_count / total_trial_count) * 100) +
          '% correct',
      ];
    },
    show_clickable_nav: true,
    button_label_previous: 'Prev',
    button_label_next: 'Next',
  };

  var final_trial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<p>You've finished the last task. Thanks for participating!</p>
      <p><a href="https://app.prolific.co/submissions/complete?cc=CK5KGDJA">Click here to return to Prolific and complete the study</a>.</p>`,
    choices: 'NO_KEYS',
  };

  const fullscreen = {
    type: jsPsychFullscreen,
  };

  var timeline = [];

  timeline = timeline.concat(fullscreen);
  timeline = timeline.concat(instructions);
  timeline = timeline.concat(comprehension_check);
  timeline = timeline.concat(ready);
  timeline = timeline.concat(learning_phase_1);
  // timeline = timeline.concat(missed_trial_loop_conditional);
  timeline = timeline.concat(instructions_05);
  timeline = timeline.concat(probe_phase_1);
  // timeline = timeline.concat(instructions_06);
  // timeline = timeline.concat(learning_phase_2);
  // timeline = timeline.concat(instructions_05);
  // timeline = timeline.concat(probe_phase_2);
  timeline = timeline.concat(complete);
  timeline = timeline.concat(final_trial);

  return timeline;
}

// Honeycomb, please include these options, and please get the timeline from this function.
export { jsPsychOptions, buildTimeline };
