package hixpro.browserlite.proxy.list

import hixpro.browserlite.proxy.R
import hixpro.browserlite.proxy.dialog.DialogItem
import hixpro.browserlite.proxy.extensions.inflater
import android.graphics.PorterDuff
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

/**
 * A [RecyclerView.Adapter] that displays [DialogItem] with icons.
 */
class RecyclerViewDialogItemAdapter(
    private val listItems: List<DialogItem>
) : RecyclerView.Adapter<DialogItemViewHolder>() {

    var onItemClickListener: ((DialogItem) -> Unit)? = null

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): DialogItemViewHolder =
        DialogItemViewHolder(
            parent.context.inflater.inflate(R.layout.dialog_list_item, parent, false)
        )

    override fun getItemCount(): Int = listItems.size

    override fun onBindViewHolder(holder: DialogItemViewHolder, position: Int) {
        val item = listItems[position]
        holder.icon.setImageDrawable(item.icon)
        item.colorTint?.let { holder.icon.setColorFilter(it, PorterDuff.Mode.SRC_IN) }
        holder.title.setText(item.title)
        holder.itemView.setOnClickListener { onItemClickListener?.invoke(item) }
    }

}

/**
 * A [RecyclerView.ViewHolder] that displays an icon and a title.
 */
class DialogItemViewHolder(view: View) : RecyclerView.ViewHolder(view) {

    /**
     * The icon to display.
     */
    val icon: ImageView = view.findViewById(R.id.icon)

    /**
     * The title to display.
     */
    val title: TextView = view.findViewById(R.id.title_text)

}