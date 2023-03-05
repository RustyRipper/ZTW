<?php
/** 
 * Plugin Name: my-plugin2
 */

function display_advertisement($content) {
    if ( is_singular( 'post' )) {
        $advertisements = get_option('advertisement_list');

        if (!$advertisements || !is_array($advertisements) || empty($advertisements)) {
            return $content;
        }

        $random_key = array_rand($advertisements);
        $advertisement = $advertisements[$random_key];

        $advertisement_html = html_entity_decode($advertisement);

        $output = '<div class="advertisement">' . $advertisement_html . '</div>';
        $output .= $content;
        return $output;
    }
    return $content;
}
add_filter('the_content', 'display_advertisement');


// Admin panel
function advertisement_options_page() {
    ?>
    <div class="wrap">
        <h1>Advertisement Options</h1>
        <?php
        
        if (isset($_POST['add_advertisement'])) {
            $advertisement = $_POST['advertisement'];
            add_advertisement($advertisement);
        }

        if (isset($_POST['delete_advertisement'])) {
            $id = intval($_POST['delete_advertisement']);
            delete_advertisement($id);
        }

        ?>
        
        <h3>Add Advertisement</h3>
        <form method="post" action="">
            <label for="advertisement">Advertisement:</label>
            <textarea name="advertisement" id="advertisement"></textarea>
            <button type="submit" name="add_advertisement" class="button">Add</button>
        </form>
        
        <h3>Current Advertisements</h3>
        <table class="widefat">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Advertisement</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <?php
                $advertisements = get_option('advertisement_list');
                if ($advertisements && is_array($advertisements) && !empty($advertisements)) {
                    foreach ($advertisements as $id => $advertisement) {
                        ?>
                        <tr>
                            <td><?php echo $id; ?></td>
                            <td><?php echo $advertisement; ?></td>
                            <td>
                                <form method="post" action="">
                                    <input type="hidden" name="delete_advertisement" value="<?php echo $id; ?>">
                                    <button type="submit" class="button">Delete</button>
                                </form>
                            </td>
                        </tr>
                        <?php
                    }
                } else {
                    ?>
                    <tr>
                        <td colspan="3">No advertisements defined.</td>
                    </tr>
                    <?php
                }
                ?>
            </tbody>
        </table>
    </div>
    <?php
}
function add_advertisement($advertisement) {
    $advertisements = get_option('advertisement_list');
    $id = count($advertisements) + 1;
    $advertisements[$id] = $advertisement;
    update_option('advertisement_list', $advertisements);
    return $id;
}
function delete_advertisement($id) {
    $advertisements = get_option('advertisement_list');
    if (isset($advertisements[$id])) {
        unset($advertisements[$id]);
        update_option('advertisement_list', $advertisements);
        return true;
    }
    return false;
}

function advertisement_options() {
    add_options_page('Advertisement Options', 'Advertisement Options', 'manage_options', 'advertisement_options', 'advertisement_options_page');
    register_setting('advertisement_options_group', 'advertisement_list');
}


add_action('admin_menu', 'advertisement_options');
function advertisement_register_styles(){
    wp_register_style('advertisement_styles', plugins_url('/css/style.css', __FILE__));
    wp_enqueue_style('advertisement_styles');
}
add_action('init', 'advertisement_register_styles'); 