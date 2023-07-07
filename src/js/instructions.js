import { ParameterType } from 'jspsych';

const info = {
  name: 'instructions',
  description: '',
  parameters: {
    pages: {
      type: ParameterType.HTML_STRING,
      pretty_name: 'Pages',
      default: undefined,
      array: true,
      description: 'Each element of the array is the content for a single page.',
    },
    symbol_L: {
      type: ParameterType.STRING,
      pretty_name: 'Symbol (left)',
      default: true,
      description: 'Key code of corresponding symbol for left knight',
    },
    symbol_R: {
      type: ParameterType.STRING,
      pretty_name: 'Symbol (right)',
      default: false,
      description: 'Key code of corresponding symbol for right knight',
    },
    key_forward: {
      type: ParameterType.KEYCODE,
      pretty_name: 'Key forward',
      default: 'arrowright',
      description: 'The key the subject can press in order to advance to the next page.',
    },
    key_backward: {
      type: ParameterType.KEYCODE,
      pretty_name: 'Key backward',
      default: 'arrowleft',
      description: 'The key that the subject can press to return to the previous page.',
    },
  },
};
/**
 * **instructions**
 *
 * Custom instructions
 *
 * @author Lucy Owen
 * @see {@link https://DOCUMENTATION_URL DOCUMENTATION LINK TEXT}
 */
class myinstructionsPlugin {
  constructor(jsPsych) {
    this.jsPsych = jsPsych;
  }
  trial(display_element, trial) {
    //---------------------------------------//
    // Define HTML.
    //---------------------------------------//
    var new_html = '';

    // Insert CSS (window animation).
    new_html += `<style>
    body {
      height: 100vh;
      max-height: 100vh;
      overflow: hidden;
      position: fixed;
    }
    .jspsych-content-wrapper {
      background: #606060;
    }
    </style>`;
    // Draw task
    new_html += '<div class="wrap">';

    // Draw background.

    new_html += `<div class="landscape-sky"</div>`;

    // Draw platforms
    new_html += '<div class="platform" id="platformL" side="left"></div>';
    new_html += '<div class="ring" id="ringL" side="left"></div>';
    new_html += '<div class="platform" id="platformR" side="right"></div>';
    new_html += '<div class="ring" id="ringR" side="right"></div>';

    // Draw left robot.
    new_html += '<div class="robot" side="left">';
    new_html += '<div class="head">';
    new_html += '<div class="visor"></div>';
    new_html += '<div class="eye" id="eyeLL" side="left"></div>';
    new_html += '<div class="eye" id="eyeLR" side="right"></div>';
    new_html += '</div>';
    new_html += '<div class="torso">';
    new_html += '<div class="left"></div>';
    new_html += '<div class="right"></div>';
    new_html += `<div class="rune" id="runeL">${trial.symbol_L}</div>`;
    new_html += '</div>';
    new_html += '<div class="shado"></div>';
    new_html += '</div>';

    // Draw right robot.
    new_html += '<div class="robot" side="right">';
    new_html += '<div class="head">';
    new_html += '<div class="visor"></div>';
    new_html += '<div class="eye" id="eyeRL" side="left"></div>';
    new_html += '<div class="eye" id="eyeRR" side="right"></div>';
    new_html += '</div>';
    new_html += '<div class="torso">';
    new_html += '<div class="left"></div>';
    new_html += '<div class="right"></div>';
    new_html += `<div class="rune" id="runeR">${trial.symbol_R}</div>`;
    new_html += '</div>';
    new_html += '<div class="shado"></div>';
    new_html += '</div>';

    // Draw instructions
    new_html += '<div class="instructions-box"><div class="instructions">';
    new_html += '</div></div>';

    // Draw buttons
    new_html += "<div class='jspsych-instructions-nav'>";
    new_html +=
      "<button id='jspsych-instructions-back' class='jspsych-btn' style='margin-right: 5px;' disabled='disabled'>&lt; Prev</button>";
    new_html +=
      "<button id='jspsych-instructions-next' class='jspsych-btn' style='margin-left: 5px;'>Next &gt;</button></div>";

    new_html += '</div>';

    // draw
    display_element.innerHTML = new_html;

    //---------------------------------------//
    // Task functions.
    //---------------------------------------//

    // Initialize variables.
    var current_page = 0;
    var view_history = [];
    var start_time = performance.now();
    var last_page_update_time = start_time;

    // Define EventListener.
    const btnListener = (evt) => {
      evt.target.removeEventListener('click', btnListener);
      if (evt.currentTarget.id === 'jspsych-instructions-back') {
        back();
      } else if (evt.currentTarget.id === 'jspsych-instructions-next') {
        next();
      }
    };

    const show_current_page = () => {
      // Update instructions text.
      display_element.querySelector(
        '.instructions'
      ).innerHTML = `<p>${trial.pages[current_page]}</p>`;

      // Update prev button

      if (current_page != 0) {
        display_element.querySelector('#jspsych-instructions-back').disabled = false;
        display_element
          .querySelector('#jspsych-instructions-back')
          .addEventListener('click', btnListener);
      } else {
        display_element.querySelector('#jspsych-instructions-back').disabled = true;
      }
      // Update next button
      display_element
        .querySelector('#jspsych-instructions-next')
        .addEventListener('click', btnListener);
    };

    const next = () => {
      add_current_page_to_view_history();

      current_page++;

      // if done, finish up...
      if (current_page >= trial.pages.length) {
        endTrial();
      } else {
        show_current_page();
      }
    };

    const back = () => {
      add_current_page_to_view_history();

      current_page--;

      show_current_page();
    };

    const add_current_page_to_view_history = () => {
      var current_time = performance.now();

      var page_view_time = current_time - last_page_update_time;

      view_history.push({
        page_index: current_page,
        viewing_time: page_view_time,
      });

      last_page_update_time = current_time;
    };

    const endTrial = () => {
      this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboard_listener);

      display_element.innerHTML = '';

      var trial_data = {
        view_history: JSON.stringify(view_history),
        rt: performance.now() - start_time,
      };

      this.jsPsych.finishTrial(trial_data);
    };

    var after_response = (info) => {
      // have to reinitialize this instead of letting it persist to prevent accidental skips of pages by holding down keys too long
      keyboard_listener = this.jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: [trial.key_forward, trial.key_backward],
        rt_method: 'performance',
        persist: false,
        allow_held_key: false,
      });
      // check if key is forwards or backwards and update page
      if (this.jsPsych.pluginAPI.compareKeys(info.key, trial.key_backward)) {
        if (current_page !== 0) {
          back();
        }
      }

      if (this.jsPsych.pluginAPI.compareKeys(info.key, trial.key_forward)) {
        next();
      }
    };

    show_current_page();

    var keyboard_listener = this.jsPsych.pluginAPI.getKeyboardResponse({
      callback_function: after_response,
      valid_responses: [trial.key_forward, trial.key_backward],
      rt_method: 'performance',
      persist: false,
    });
  }
}
myinstructionsPlugin.info = info;

export default myinstructionsPlugin;
